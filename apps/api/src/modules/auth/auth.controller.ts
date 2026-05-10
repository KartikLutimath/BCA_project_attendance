import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { success } from "@/common/response";
import { RegisterDTO, LoginDTO, RefreshDTO, LogoutDTO } from "./auth.validation";

/**
 * POST /api/v1/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, email, password, role } = req.body as RegisterDTO;
    const result = await AuthService.register(fullName, email, password, role);
    res.status(201).json(success("Account created successfully", result));
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginDTO;
    const result = await AuthService.login(email, password);
    res.status(200).json(success("Login successful", result));
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/refresh
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body as RefreshDTO;
    const tokens = await AuthService.refresh(refreshToken);
    res.status(200).json(success("Tokens refreshed", tokens));
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body as LogoutDTO;
    await AuthService.logout(refreshToken);
    res.status(200).json(success("Logged out successfully"));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/auth/me
 * Requires: authenticate middleware
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await AuthService.getMe(req.user!.sub);
    res.status(200).json(success("User profile fetched", user));
  } catch (err) {
    next(err);
  }
};
