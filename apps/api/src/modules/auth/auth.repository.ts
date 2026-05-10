import { prisma } from "@/config/database";
import { Role } from "@prisma/client";
import { TOKEN } from "@/common/constants";
import { signRefreshToken } from "@/utils/jwt.utils";
import { randomUUID } from "crypto";

// ─── User queries ─────────────────────────────────────────────────────────────

export class AuthRepository {
  static async findUserByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  static async findUserById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  static async createUser(data: {
    fullName: string;
    email: string;
    passwordHash: string;
    role: Role;
  }) {
    return prisma.user.create({ data });
  }

  // ─── Refresh token queries ──────────────────────────────────────────────────

  static async createRefreshToken(userId: string): Promise<string> {
    // Generate a unique record ID upfront so we can embed it in the JWT
    const tokenId = randomUUID();
    const expiresAt = new Date(Date.now() + TOKEN.REFRESH_EXPIRES_MS);

    // Sign the JWT with the pre-generated tokenId
    const token = signRefreshToken({ sub: userId, tokenId });

    // Single insert — no placeholder, no collision
    await prisma.refreshToken.create({
      data: {
        id: tokenId,
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  static async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  static async revokeRefreshToken(token: string) {
    return prisma.refreshToken.updateMany({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }

  static async revokeRefreshTokenById(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  /** Purge all expired and revoked tokens for a user (cleanup) */
  static async purgeExpiredTokens(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
        OR: [
          { expiresAt: { lt: new Date() } },
          { revokedAt: { not: null } },
        ],
      },
    });
  }
}
