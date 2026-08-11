const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {
  test("rejects invalid email during registration", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "invalid-email",
      password: "password123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  test("rejects password shorter than 8 characters", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  test("rejects registration when name is missing", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });

  test("registers a valid user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
  });

  test("rejects duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Another User",
      email: "test@example.com",
      password: "password123",
    });

    expect([400, 409]).toContain(response.statusCode);
  });

  test("rejects case-insensitive duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "Test@Example.com",
      password: "password123",
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Another User",
      email: "test@example.com",
      password: "password123",
    });

    expect([400, 409]).toContain(response.statusCode);
  });

  test("rejects NoSQL injection attempt", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: {
          $gt: "",
        },
        password: {
          $gt: "",
        },
      });

    expect(response.statusCode).toBe(400);
  });
  test("logs in with valid credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "password123",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("rejects login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "wrongpass@example.com",
      password: "password123",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "wrongpass@example.com",
      password: "wrongpassword",
    });

    expect(response.statusCode).toBe(400);
  });

  test("rejects login for nonexistent user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "doesnotexist@example.com",
      password: "password123",
    });

    expect(response.statusCode).toBe(400);
  });

  test("rejects login with invalid email", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "not-an-email",
      password: "password123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Validation failed");
  });
  test("rejects access to /api/me without token", async () => {
    const response = await request(app).get("/api/me");

    expect(response.statusCode).toBe(401);
  });

  test("rejects access to /api/me with malformed token", async () => {
    const response = await request(app)
      .get("/api/me")
      .set("Authorization", "Bearer invalid-token");

    expect(response.statusCode).toBe(401);
  });

  test("allows access to /api/me with valid token", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Protected User",
      email: "protected@example.com",
      password: "password123",
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "protected@example.com",
      password: "password123",
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/api/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
});
