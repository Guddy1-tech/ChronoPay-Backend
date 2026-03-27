import express from "express";
import cors from "cors";
import process from "node:process";
import { validateRequiredFields } from "./middleware/validation.js";
import { configService } from "./config/config.service.js";

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

/**
 * Dummy token verification endpoint to demonstrate secret rotation.
 * In a real application, this would use a JWT library.
 */
app.post("/api/v1/auth/verify", (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, error: "Token is required" });
  }

  // Get all active versions of the secret (primary + previous during rotation)
  const validSecrets = configService.getAllSecretVersions("JWT_SECRET");

  // Simulate token verification against all valid secrets
  const isValid = validSecrets.some((secret) => token === `valid-token-for-${secret}`);

  if (isValid) {
    res.json({ success: true, message: "Token is valid" });
  } else {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
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

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`ChronoPay API listening on http://localhost:${PORT}`);
  });
}

export default app;
