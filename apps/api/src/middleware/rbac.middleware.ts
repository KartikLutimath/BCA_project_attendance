import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { AuthenticationError, AuthorizationError } from "@/common/errors";

/**
 * authorize — RBAC middleware factory.
 * Call after authenticate() middleware.
 *
 * Usage:
 *   router.get("/admin", authenticate, authorize(["ADMIN"]), ctrl.handler)
 *   router.post("/mark",  authenticate, authorize(["STUDENT"]), ctrl.handler)
 */
export const authorize =
  (allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError());
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AuthorizationError(
          `Access restricted to: ${allowedRoles.join(", ")}`
        )
      );
    }

    next();
  };
