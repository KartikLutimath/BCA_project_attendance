import { Role } from "@prisma/client";
import { AuthRepository } from "./auth.repository";
import { hashPassword, verifyPassword } from "@/utils/hash.utils";
import { signAccessToken, verifyRefreshToken } from "@/utils/jwt.utils";
import {
  AppError,
  AuthenticationError,
  ConflictError,
} from "@/common/errors";
import { AuthTokens, SafeUser } from "./auth.types";

export class AuthService {
  /**
   * Register a new user.
   * Rejects if email already exists.
   */
  static async register(
    fullName: string,
    email: string,
    password: string,
    role: Role
  ): Promise<{ user: SafeUser; tokens: AuthTokens }> {
    const existing = await AuthRepository.findUserByEmail(email);
    if (existing) {
      throw new ConflictError("An account with this email already exists");
    }

    const passwordHash = await hashPassword(password);
    const user = await AuthRepository.createUser({
      fullName,
      email,
      passwordHash,
      role,
    });

    const accessToken = signAccessToken({
      sub: user.id,
      role: user.role,
      email: user.email,
    });
    const refreshToken = await AuthRepository.createRefreshToken(user.id);

    return {
      user: AuthService.toSafeUser(user),
      tokens: { accessToken, refreshToken, role: user.role },
    };
  }

  /**
   * Login — validates credentials and returns tokens.
   * Deliberately uses the same generic error for wrong email or password
   * (prevents user enumeration).
   */
  static async login(
    email: string,
    password: string
  ): Promise<{ user: SafeUser; tokens: AuthTokens }> {
    const user = await AuthRepository.findUserByEmail(email);

    // Generic error — do NOT distinguish "user not found" from "wrong password"
    if (!user) throw new AuthenticationError("Invalid credentials");

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) throw new AuthenticationError("Invalid credentials");

    if (!user.isActive) {
      throw new AppError("Your account has been suspended. Contact admin.", 403, "ACCOUNT_SUSPENDED");
    }

    // Purge stale tokens in the background (non-blocking)
    AuthRepository.purgeExpiredTokens(user.id).catch(() => {});

    const accessToken = signAccessToken({
      sub: user.id,
      role: user.role,
      email: user.email,
    });
    const refreshToken = await AuthRepository.createRefreshToken(user.id);

    return {
      user: AuthService.toSafeUser(user),
      tokens: { accessToken, refreshToken, role: user.role },
    };
  }

  /**
   * Refresh — issues a new access token.
   * Rotates the refresh token on every use (prevents token replay attacks).
   */
  static async refresh(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify JWT signature first (fast, no DB hit)
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AuthenticationError("Invalid refresh token");
    }

    // Validate against DB record
    const stored = await AuthRepository.findRefreshToken(refreshToken);

    if (!stored) throw new AuthenticationError("Refresh token not found");
    if (stored.revokedAt) throw new AuthenticationError("Refresh token has been revoked");
    if (stored.expiresAt < new Date()) throw new AuthenticationError("Refresh token has expired");
    if (!stored.user.isActive) throw new AppError("Account suspended", 403, "ACCOUNT_SUSPENDED");

    // Rotate: revoke old token, issue new pair
    await AuthRepository.revokeRefreshTokenById(stored.id);

    const newAccessToken = signAccessToken({
      sub: stored.user.id,
      role: stored.user.role,
      email: stored.user.email,
    });
    const newRefreshToken = await AuthRepository.createRefreshToken(stored.user.id);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Logout — revokes the provided refresh token.
   */
  static async logout(refreshToken: string): Promise<void> {
    await AuthRepository.revokeRefreshToken(refreshToken);
  }

  /**
   * Get current authenticated user profile.
   */
  static async getMe(userId: string): Promise<SafeUser> {
    const user = await AuthRepository.findUserById(userId);
    if (!user) throw new AuthenticationError("User not found");
    return AuthService.toSafeUser(user);
  }

  /** Strip sensitive fields before returning user data */
  private static toSafeUser(user: {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    isActive: boolean;
    createdAt: Date;
  }): SafeUser {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
