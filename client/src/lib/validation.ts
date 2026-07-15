import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(80),
  email: z.string().trim().email('Enter a valid email address'),
  subject: z.string().trim().min(3, 'Add a short subject').max(120),
  message: z.string().trim().min(20, 'Message should be at least 20 characters').max(2000),
  company: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
})

export type ContactSchema = z.infer<typeof contactSchema>
