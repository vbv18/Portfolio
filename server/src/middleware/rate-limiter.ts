import rateLimit from 'express-rate-limit'

export const contactRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many messages sent. Please try again later.' },
})
