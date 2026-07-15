import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("4000"),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.string().default("587"),
  SMTP_SECURE: z.string().default("false"),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
  CONTACT_TO_EMAIL: z.string().email("CONTACT_TO_EMAIL must be a valid email"),
  CONTACT_FROM_EMAIL: z
    .string()
    .email("CONTACT_FROM_EMAIL must be a valid email"),
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
