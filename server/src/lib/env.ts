import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("4000"),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  GEMINI_API_KEY: z.string().optional().default(""),
  GEMINI_MODEL: z.string().default("gemini-3.5-flash-lite"),
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.string().default("587"),
  SMTP_SECURE: z.string().default("false"),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  CONTACT_TO_EMAIL: z.string().default("admin@example.com"),
  CONTACT_FROM_EMAIL: z.string().default("admin@example.com"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  console.error(
    "\nCopy server/.env.example to server/.env and fill in real values.",
  );
  process.exit(1);
}

export const env = parsed.data;
