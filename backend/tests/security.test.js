const request = require("supertest");
const app = require("../app");

describe("Security middleware", () => {
  async function getAuthToken() {
    await request(app).post("/api/auth/register").send({
      name: "Security Test User",
      email: "security@example.com",
      password: "password123",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "security@example.com",
      password: "password123",
    });

    return response.body.token;
  }

  // Helmet
  test("Helmet adds security headers", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

    expect(response.headers["x-content-type-options"]).toBe("nosniff");

    expect(response.headers["x-frame-options"]).toBeDefined();
  });

  // CORS

  test("CORS allows configured frontend origin", async () => {
    const response = await request(app)
      .get("/")
      .set("Origin", "http://localhost:5173");

    expect(response.statusCode).toBe(200);

    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173",
    );
  });

  test("CORS does not allow an unknown origin", async () => {
    const response = await request(app)
      .get("/")
      .set("Origin", "https://example.com");

    expect(response.statusCode).toBe(200);

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  // Resume upload

  test("rejects resume upload without authentication", async () => {
    const response = await request(app)
      .post("/api/resume/analyze")
      .attach("resume", Buffer.from("fake pdf content"), "resume.pdf");

    expect(response.statusCode).toBe(401);
  });
  test("rejects non-PDF resume", async () => {
    const token = await getAuthToken();

    const response = await request(app)
      .post("/api/resume/analyze")
      .set("Authorization", `Bearer ${token}`)
      .attach("resume", Buffer.from("this is not a PDF"), "resume.txt");

    expect(response.statusCode).toBe(400);

    expect(response.body.message).toBe("Only PDF files are allowed");
  });
  test("rejects resume larger than 5MB", async () => {
    const token = await getAuthToken();

    const largeFile = Buffer.alloc(6 * 1024 * 1024);

    const response = await request(app)
      .post("/api/resume/analyze")
      .set("Authorization", `Bearer ${token}`)
      .attach("resume", largeFile, "large-resume.pdf");

    expect(response.statusCode).toBe(400);

    expect(response.body.message).toBe("File too large (max 5MB)");
  });
});
