import rateLimit from "express-rate-limit";

export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages sent. Please try again later." },
});

export const terminalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Rate limit reached for AI terminal queries. Please wait a few minutes before asking more questions.",
  },
});
