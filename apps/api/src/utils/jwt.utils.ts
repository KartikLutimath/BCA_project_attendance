import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { Role } from "@prisma/client";

// ─── Token payload types ──────────────────────────────────────────────────────

export interface AccessTokenPayload {
  sub: string;   // userId
  role: Role;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string;      // userId
  tokenId: string;  // RefreshToken.id (for revocation)
  iat?: number;
  exp?: number;
}

// ─── Sign ─────────────────────────────────────────────────────────────────────

export const signAccessToken = (
  payload: Omit<AccessTokenPayload, "iat" | "exp">
): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES as jwt.SignOptions["expiresIn"],
  });

export const signRefreshToken = (
  payload: Omit<RefreshTokenPayload, "iat" | "exp">
): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES as jwt.SignOptions["expiresIn"],
  });

// ─── Verify ───────────────────────────────────────────────────────────────────

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
