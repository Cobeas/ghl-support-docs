"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
//import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validateFields = ResetSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Invalid email" };
    }

    const { email } = validateFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Email does not exist" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    //await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    try {
        await signIn("resend", {
            email: existingUser.email,
            redirectTo: `${process.env.SERVER_URL}/auth/reset-password?token=${passwordResetToken.token}`,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: error.message };
        }

        throw error;
    }

    return { success: "Please check your email to reset your password" };
};

export const checkPassword = async (password: string, confirmPassword: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>]{8,}$/;
        const isValid1 = passwordRegex.test(password);
        const isValid2 = passwordRegex.test(confirmPassword);
        const isSame = password === confirmPassword;

        resolve(isValid1 && isValid2 && isSame);
    });
};