/**
 * attendanceJob.ts
 * Scheduled job — Phase 7 implementation.
 *
 * Will handle:
 * - Purging expired refresh tokens (weekly)
 * - Auto-marking absent for missed sessions
 * - Sending low-attendance notifications
 *
 * Placeholder for Phase 7.
 */

import { prisma } from "@/config/database";
import { logger } from "@/config/logger";

/**
 * Purge expired and revoked refresh tokens older than 7 days.
 * Safe to run weekly via a cron or BullMQ job.
 */
export async function purgeExpiredRefreshTokens(): Promise<void> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const result = await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { revokedAt: { not: null, lt: sevenDaysAgo } },
      ],
    },
  });
  logger.info(`Purged ${result.count} expired refresh tokens`);
}
