import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(20).max(2000),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const terminalMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Please enter a question or command.")
    .max(500, "Message cannot exceed 500 characters."),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .max(10, "History is limited to the last 10 messages.")
    .optional(),
});

export type TerminalMessageInput = z.infer<typeof terminalMessageSchema>;
