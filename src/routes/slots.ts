import { Router } from "express";
import { validateRequiredFields } from "../middleware/validation.js";
import { idempotencyMiddleware } from "../middleware/idempotency.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ slots: [] });
});

router.post(
  "/",
  validateRequiredFields(["professional", "startTime", "endTime"]),
  idempotencyMiddleware,
  (req, res) => {
    const { professional, startTime, endTime } = req.body;

    res.status(201).json({
      success: true,
      slot: {
        id: 1,
        professional,
        startTime,
        endTime,
      },
    });
  },
);

export default router;
