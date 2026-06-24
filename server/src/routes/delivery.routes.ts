import { Router } from "express";
import * as deliveryController from "../controllers/delivery.controller";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.use(authenticate, requireRole("delivery_partner"));

router.get("/dashboard", deliveryController.getDashboard);
router.get("/orders", deliveryController.getAssignedOrders);
router.patch("/orders/:id/status", deliveryController.updateStatus);

export default router;
