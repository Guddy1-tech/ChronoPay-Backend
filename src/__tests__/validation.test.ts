import request from "supertest";
import app from "../index.js";

describe("Input validation middleware", () => {
  it("should reject slot creation when role header is missing", async () => {
    const res = await request(app).post("/api/v1/slots").send({
      professional: "alice",
      startTime: 1000,
      endTime: 2000,
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should reject slot creation when role is invalid", async () => {
    const res = await request(app)
      .post("/api/v1/slots")
      .set("x-user-role", "hacker")
      .send({
        professional: "alice",
        startTime: 1000,
        endTime: 2000,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject slot creation when role is not authorized", async () => {
    const res = await request(app)
      .post("/api/v1/slots")
      .set("x-user-role", "customer")
      .send({
        professional: "alice",
        startTime: 1000,
        endTime: 2000,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should allow valid slot creation", async () => {
    const res = await request(app)
      .post("/api/v1/slots")
      .set("x-user-role", "professional")
      .send({
        professional: "alice",
        startTime: 1000,
        endTime: 2000,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should allow slot creation for admin role", async () => {
    const res = await request(app)
      .post("/api/v1/slots")
      .set("x-user-role", "admin")
      .send({
        professional: "alice",
        startTime: 1000,
        endTime: 2000,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should reject missing professional", async () => {
    const res = await request(app)
      .post("/api/v1/slots")
      .set("x-user-role", "professional")
      .send({
        startTime: 1000,
        endTime: 2000,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject missing startTime", async () => {
    const res = await request(app)
      .post("/api/v1/slots")
      .set("x-user-role", "professional")
      .send({
        professional: "alice",
        endTime: 2000,
      });

    expect(res.status).toBe(400);
  });

  it("should reject empty values", async () => {
    const res = await request(app)
      .post("/api/v1/slots")
      .set("x-user-role", "professional")
      .send({
        professional: "",
        startTime: 1000,
        endTime: 2000,
      });

    expect(res.status).toBe(400);
  });

  it("should normalize role header values", async () => {
    const res = await request(app)
      .post("/api/v1/slots")
      .set("x-user-role", "  PrOfEsSiOnAl  ")
      .send({
        professional: "alice",
        startTime: 1000,
        endTime: 2000,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});