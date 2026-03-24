import express from "express";
import cors from "cors";
import { validateRequiredFields } from "./middleware/validation";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: { title: "ChronoPay API", version: "1.0.0" },
  },
  apis: ["./src/routes/*.ts"], // adjust if needed
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "chronopay-backend" });
});

app.get("/api/v1/slots", (_req, res) => {
  res.json({ slots: [] });
});

app.post(
  "/api/v1/slots",
  validateRequiredFields(["professional", "startTime", "endTime"]),
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

const VALID_SETTLEMENT_EVENT_TYPES = [
  "settlement_initiated",
  "settlement_completed",
  "settlement_failed",
] as const;

app.post(
  "/api/v1/webhooks/settlements",
  validateRequiredFields(["eventType", "transactionId", "amount", "timestamp"]),
  (req, res) => {
    const { eventType, transactionId, amount, timestamp } = req.body;

    if (!VALID_SETTLEMENT_EVENT_TYPES.includes(eventType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid eventType. Must be one of: ${VALID_SETTLEMENT_EVENT_TYPES.join(", ")}`,
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid amount. Must be a positive number",
      });
    }

    if (typeof timestamp !== "number" || timestamp <= 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid timestamp. Must be a positive number",
      });
    }

    res.status(200).json({
      success: true,
      received: {
        eventType,
        transactionId,
        amount,
        timestamp,
      },
    });
  },
);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`ChronoPay API listening on http://localhost:${PORT}`);
  });
}

export default app;
