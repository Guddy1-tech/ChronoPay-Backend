import request from "supertest";
import app from "../index.js";

describe("ChronoPay API", () => {
  it("GET /health returns 200 and status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("chronopay-backend");
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("version");
  });

  it("GET /ready returns 200 and status ready", async () => {
    const res = await request(app).get("/ready");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ready");
    expect(res.body.service).toBe("chronopay-backend");
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("version");
  });

  it("GET /live returns 200 and status alive", async () => {
    const res = await request(app).get("/live");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("alive");
    expect(res.body.service).toBe("chronopay-backend");
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("version");
  });

  it("GET /api/v1/slots returns slots array", async () => {
    const res = await request(app).get("/api/v1/slots");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.slots)).toBe(true);
  });
});
