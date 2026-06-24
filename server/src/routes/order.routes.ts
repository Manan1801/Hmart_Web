import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/addresses", orderController.getAddresses);
router.post("/addresses", orderController.createAddress);
router.post("/checkout", orderController.checkout);
router.get("/orders", orderController.getOrders);
router.get("/orders/:id", orderController.getOrderById);

export default router;
