import { Router, Request, Response, NextFunction } from "express";
import * as contactService from "../services/contact.service";
import { authenticate, requireRole } from "../middleware/auth";
import type { AuthenticatedRequest } from "../types";

const router = Router();

router.post("/contact", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, name, email, phone, orderReference, message } = req.body;
    const inquiry = await contactService.createInquiry({
      type: type ?? "general",
      name: name ?? "",
      email: email ?? "",
      phone,
      orderReference,
      message: message ?? "",
    });
    res.status(201).json({ success: true, data: { inquiry } });
  } catch (err) {
    next(err);
  }
});

router.get(
  "/admin/inquiries",
  authenticate,
  requireRole("admin"),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const status = req.query.status as string | undefined;
      const result = await contactService.getInquiries(page, status);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  "/admin/inquiries/:id/status",
  authenticate,
  requireRole("admin"),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      await contactService.updateInquiryStatus(id, status);
      res.json({ success: true, data: { message: "Status updated" } });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
