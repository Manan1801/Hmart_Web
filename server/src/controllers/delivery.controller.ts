import { Response, NextFunction } from "express";
import { z } from "zod";
import * as deliveryService from "../services/delivery.service";
import { AppError } from "../middleware/error-handler";
import type { AuthenticatedRequest } from "../types";

export async function getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const stats = await deliveryService.getDashboard(req.user.userId);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getAssignedOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const orders = await deliveryService.getAssignedOrders(req.user.userId);
    res.json({ success: true, data: { orders } });
  } catch (err) {
    next(err);
  }
}

const updateStatusSchema = z.object({
  status: z.enum(["accepted", "picked_up", "in_transit", "delivered", "failed"]),
  note: z.string().optional(),
});

export async function updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Authentication required");
    const deliveryId = req.params.id as string;
    const { status, note } = updateStatusSchema.parse(req.body);
    const result = await deliveryService.updateDeliveryStatus(req.user.userId, deliveryId, status, note);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
