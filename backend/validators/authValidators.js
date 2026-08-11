const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "name is required")
    .max(100, "name must be at most 100 characters"),

  email: z.string().trim().toLowerCase().email("invalid email format"),

  password: z
    .string()
    .min(8, "password must be at least 8 characters")
    .max(72, "password must be at most 72 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("invalid email format"),

  password: z.string().min(1, "password is required"),
});

module.exports = {
  registerSchema,
  loginSchema,
};
