process.env.TEST_RATE_LIMIT = "true";

const request = require("supertest");
const app = require("../app");

describe("Authentication rate limiter", () => {
  test("blocks authentication after 10 attempts", async () => {
    const responses = [];

    for (let i = 0; i < 11; i++) {
      const response = await request(app).post("/api/auth/login").send({
        email: "ratelimit@example.com",
        password: "wrongpassword",
      });

      responses.push(response);
    }

    const lastResponse = responses[responses.length - 1];

    expect(lastResponse.statusCode).toBe(429);

    expect(lastResponse.body.message).toBe(
      "Too many authentication attempts. Please try again later.",
    );
  });
});
