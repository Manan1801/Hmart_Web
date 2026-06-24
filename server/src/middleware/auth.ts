import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "./error-handler";
import type { AuthenticatedRequest } from "../types";

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError(401, "UNAUTHORIZED", "Access token required");
  }

  const token = authHeader.slice(7);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    throw new AppError(401, "TOKEN_EXPIRED", "Access token expired or invalid");
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, "FORBIDDEN", "Insufficient permissions");
    }

    next();
  };
}
