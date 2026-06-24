import { Response, NextFunction } from "express";
import { z } from "zod";
import * as orderService from "../services/order.service";
import { AppError } from "../middleware/error-handler";
import type { AuthenticatedRequest } from "../types";

const createAddressSchema = z.object({
  recipientName: z.string().min(2),
  phone: z.string().min(7).max(20),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(4).max(10),
  isDefault: z.boolean().optional(),
});

const checkoutSchema = z.object({
  addressId: z.string().min(1),
});

export async function getAddresses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const addresses = await orderService.getAddresses(req.user.userId);
    res.json({ success: true, data: { addresses } });
  } catch (err) {
    next(err);
  }
}

export async function createAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const body = createAddressSchema.parse(req.body);
    const address = await orderService.createAddress(req.user.userId, body);
    res.status(201).json({ success: true, data: { address } });
  } catch (err) {
    next(err);
  }
}

export async function checkout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const { addressId } = checkoutSchema.parse(req.body);
    const result = await orderService.checkout(req.user.userId, addressId);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const orders = await orderService.getOrders(req.user.userId);
    res.json({ success: true, data: { orders } });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const orderId = req.params.id as string;
    const order = await orderService.getOrderById(req.user.userId, orderId);
    res.json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
}
