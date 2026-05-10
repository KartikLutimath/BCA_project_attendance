import { prisma } from "@/config/database";
import { Role } from "@prisma/client";
import { TOKEN } from "@/common/constants";
import { signRefreshToken } from "@/utils/jwt.utils";

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
    // Step 1: create record to get the DB-generated id
    const record = await prisma.refreshToken.create({
      data: {
        token: "placeholder",
        userId,
        expiresAt: new Date(Date.now() + TOKEN.REFRESH_EXPIRES_MS),
      },
    });

    // Step 2: sign with real tokenId for revocation support
    const token = signRefreshToken({ sub: userId, tokenId: record.id });

    // Step 3: update the record with the signed token
    await prisma.refreshToken.update({
      where: { id: record.id },
      data: { token },
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
