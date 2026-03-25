import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import slotsRouter from "./routes/slots.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { getRedisClient } from "./utils/redis.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: { title: "ChronoPay API", version: "1.0.0" },
  },
  apis: ["./src/routes/*.ts"], // adjust if needed
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/health", async (_req, res) => {
  try {
    const redis = getRedisClient();
    await redis.ping();
    res.json({ status: "ok", service: "chronopay-backend", redis: "connected" });
  } catch (err) {
    res.status(503).json({ status: "error", service: "chronopay-backend", redis: "disconnected" });
  }
});

app.use("/api/v1/slots", slotsRouter);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`ChronoPay API listening on http://localhost:${PORT}`);
  });
}

export default app;
