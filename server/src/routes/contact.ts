import { Router, type Request, type Response } from "express";
import { contactSchema } from "../lib/validation.js";
import { sendContactEmail } from "../lib/mailer.js";
import { contactRateLimiter } from "../middleware/rate-limiter.js";

export const contactRouter = Router();

contactRouter.post(
  "/contact",
  contactRateLimiter,
  async (req: Request, res: Response) => {
    const parsed = contactSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Please check the form fields and try again.",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, email, subject, message, company } = parsed.data;

    if (company) {
      return res.status(200).json({ message: "Message sent." });
    }

    try {
      await sendContactEmail({ name, email, subject, message });
      return res
        .status(200)
        .json({ message: "Message sent — thanks for reaching out." });
    } catch (error) {
      console.error("Failed to send contact email:", error);
      return res.status(502).json({
        message:
          "Could not send your message right now. Please try again shortly.",
      });
    }
  },
);
