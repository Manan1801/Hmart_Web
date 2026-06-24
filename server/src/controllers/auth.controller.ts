import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "../utils/jwt";
import { AppError } from "../middleware/error-handler";
import type { AuthenticatedRequest } from "../types";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const body = registerSchema.parse(req.body);
    const result = await authService.register(body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({ success: true, data: { accessToken: result.accessToken, user: result.user } });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const body = loginSchema.parse(req.body);
    const result = await authService.login(body);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ success: true, data: { accessToken: result.accessToken, user: result.user } });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      throw new AppError(401, "NO_REFRESH_TOKEN", "Refresh token not found");
    }

    const payload = verifyRefreshToken(token);
    const newPayload = { userId: payload.userId, email: payload.email, role: payload.role };
    const accessToken = signAccessToken(newPayload);
    const refreshToken = signRefreshToken(newPayload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    }

    const user = await authService.getMe(req.user.userId);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("refreshToken", { path: "/" });
  res.json({ success: true, data: { message: "Logged out" } });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");

    const { fullName, phone } = req.body;
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (fullName !== undefined) updateData.full_name = fullName;
    if (phone !== undefined) updateData.phone = phone || null;

    const { supabase } = await import("../lib/supabase");
    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", req.user.userId);

    if (error) throw new AppError(500, "DB_ERROR", error.message);

    const user = await authService.getMe(req.user.userId);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}
