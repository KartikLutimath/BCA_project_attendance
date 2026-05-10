import { Request, Response, NextFunction } from "express";
import { UsersService } from "./users.service";
import { success } from "@/common/response";
import { UpdateProfileDTO } from "./users.validation";

/**
 * GET /api/v1/users/me — get own profile (any role)
 */
export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await UsersService.getProfile(req.user!.sub);
    res.status(200).json(success("Profile fetched", user));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/users/:id — get user by ID (ADMIN only)
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await UsersService.getProfile(req.params.id);
    res.status(200).json(success("User fetched", user));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/users — list all users (ADMIN only)
 */
export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await UsersService.listUsers(page, limit);
    res.status(200).json(success("Users fetched", result));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/users/:id — update profile
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await UsersService.updateProfile(
      req.user!.sub,
      req.params.id,
      req.user!.role,
      req.body as UpdateProfileDTO
    );
    res.status(200).json(success("Profile updated", updated));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/users/:id/deactivate — ADMIN only
 */
export const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await UsersService.deactivateUser(req.params.id);
    res.status(200).json(success("User deactivated"));
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/users/:id/activate — ADMIN only
 */
export const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await UsersService.activateUser(req.params.id);
    res.status(200).json(success("User activated"));
  } catch (err) {
    next(err);
  }
};
