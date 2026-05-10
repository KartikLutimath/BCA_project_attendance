import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt.utils";
import { AuthenticationError } from "@/common/errors";

/**
 * authenticate — verifies the Bearer access token on every protected route.
 * Attaches the decoded payload to req.user.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new AuthenticationError("Missing authorization token"));
  }

  const token = header.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    next(new AuthenticationError("Invalid or expired token"));
  }
};
