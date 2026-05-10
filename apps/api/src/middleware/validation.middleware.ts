import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { failure } from "@/common/response";

/**
 * validate — Zod request validation middleware factory.
 * Validates req.body, req.query, and req.params against the provided schema.
 *
 * Usage:
 *   router.post("/register", validate(registerSchema), ctrl.register)
 */
export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(422).json(
          failure("Validation failed", err.errors)
        );
        return;
      }
      next(err);
    }
  };
