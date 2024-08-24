import { db } from "@/lib/db";

export const getTwoFaConfirmationByUserId = async (userId: string) => {
    try {
        const twoFaConfirmation = await db.twoFactorConfirm.findUnique({
            where: { userId }
        });

        return twoFaConfirmation;
    } catch {
        return null;
    }
};