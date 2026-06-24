import { Response, NextFunction } from "express";
import { z } from "zod";
import * as cartService from "../services/cart.service";
import { AppError } from "../middleware/error-handler";
import type { AuthenticatedRequest } from "../types";

const addItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(999),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0).max(999),
});

export async function getCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const cart = await cartService.getCart(req.user.userId);
    res.json({ success: true, data: { cart } });
  } catch (err) {
    next(err);
  }
}

export async function addItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const { variantId, quantity } = addItemSchema.parse(req.body);
    const cart = await cartService.addItem(req.user.userId, variantId, quantity);
    res.json({ success: true, data: { cart } });
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const variantId = req.params.variantId as string;
    const { quantity } = updateItemSchema.parse(req.body);
    const cart = await cartService.updateItem(req.user.userId, variantId, quantity);
    res.json({ success: true, data: { cart } });
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const variantId = req.params.variantId as string;
    const cart = await cartService.removeItem(req.user.userId, variantId);
    res.json({ success: true, data: { cart } });
  } catch (err) {
    next(err);
  }
}
