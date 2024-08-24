import { Resend } from "resend";
import { appSettings } from "@/app-settings";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.SERVER_URL}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: appSettings.email.from,
        to: email,
        subject: "Verify your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to verify your email</p>`,
    });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.SERVER_URL}/auth/reset-password?token=${token}`;

    await resend.emails.send({
        from: appSettings.email.from,
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    });
};

export const sendTwoFaTokenEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: appSettings.email.from,
        to: email,
        subject: "Two-factor authentication token",
        text: `Your two-factor authentication token is: ${token}`,
    });
}