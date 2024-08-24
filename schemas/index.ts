import * as z from "zod";

// Auth Schemas
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const ResetSchema = z.object({
    email: z.string().email(),
});

const passwordSchema = z.string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[@$!%*?&]/);

export const NewPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
});

export const SettingSchema = z.object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    istwofa: z.optional(z.boolean()),
    password: z.optional(z.string()),
    newPassword: z.optional(passwordSchema),
})