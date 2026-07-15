import { z } from "zod";
export declare const contactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    subject: z.ZodString;
    message: z.ZodString;
    company: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export type ContactInput = z.infer<typeof contactSchema>;
//# sourceMappingURL=validation.d.ts.map