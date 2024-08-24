"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { generateVerifyToken, generateTwoFaToken } from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFaTokenEmail } from "@/lib/mail";
import { getTwoFaTokenByEmail } from "@/data/twofa-token";
import { getTwoFaConfirmationByUserId } from "@/data/twofa-confirmation";
import { appSettings } from "@/app-settings";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Invalid credentials" };
    }

    const { email, password, code } = validateFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist" };
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerifyToken(existingUser.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Please confirm your email address. We sent you a new link!" };
    }

    if (existingUser.istwofa && existingUser.email && appSettings.authentication.useTwoFa) {

        if (code) {
            const twoFaToken = await getTwoFaTokenByEmail(existingUser.email);

            if (!twoFaToken || twoFaToken.token !== code) {
                return { error: "Invalid two-factor code" };
            }

            if (twoFaToken.token !== code) {
                return { error: "Invalid two-factor code" };
            }

            const hasExpired = new Date(twoFaToken.expires) < new Date();

            if (hasExpired) {
                return { error: "Two-factor code has expired" };
            }

            await db.twofactortoken.delete({ where: { id: twoFaToken.id } });

            const existingConfirmation = await getTwoFaConfirmationByUserId(existingUser.id);

            if (existingConfirmation) {
                await db.twoFactorConfirm.delete({ where: { id: existingConfirmation.id } });
            }

            await db.twoFactorConfirm.create({
                data: {
                    userId: existingUser.id,
                }
            });
        } else {
            const twoFaToken = await generateTwoFaToken(existingUser.email);

            await sendTwoFaTokenEmail(twoFaToken.email, twoFaToken.token);

            return { twoFactor: true };
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin": 
                    return { error: "Invalid credentials" };
                default: 
                    return { error: "An error occurred" };
            }
        }

        throw error;
    }
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Invalid credentials" };
    }

    const { email, password } = validateFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "User already exists" };
    }

    await db.user.create({
        data: {
            email,
            password: hashedPassword
        }
    });


    const verificationToken = await generateVerifyToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "You will receive a verification email" };
};

export const validate = async (value: string, type: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (type === "email") {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            const isValid = emailRegex.test(value);
            resolve(isValid);
        }
        
        if (type === "password") {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>]{8,}$/;
            const isValid = passwordRegex.test(value);
            resolve(isValid);
        }

        resolve(false);
    });
};