import bcrypt from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "@/common/constants";

/**
 * Hash a plain-text password.
 * Always uses BCRYPT_SALT_ROUNDS (12) — never lower in production.
 */
export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, BCRYPT_SALT_ROUNDS);

/**
 * Compare a plain-text password against a stored bcrypt hash.
 */
export const verifyPassword = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);
