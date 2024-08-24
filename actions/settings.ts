"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { SettingSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerifyToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = user.id ? await getUserById(user.id) : undefined;
    console.log("DB User", dbUser);
    console.log("Values", values);

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use" };
        }

        const verificationToken = await generateVerifyToken(values.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Verification email sent" };
    }

    if (values.password && values.newPassword && dbUser.password) {
        console.log("Changing password", values.password, values.newPassword);
        const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);

        console.log("Passwords match", passwordsMatch);

        if (!passwordsMatch) {
            return { error: "Incorrect password" };
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);

        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values,
        }
    })

    return { success: "Settings updated" };
}