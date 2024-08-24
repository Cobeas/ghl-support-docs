import { db } from "@/lib/db";

export const getTwoFaTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.twofactortoken.findUnique({
            where: { token }
        })

        return twoFactorToken;
    } catch {
        return null;
    }
};

export const getTwoFaTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.twofactortoken.findFirst({
            where: { email }
        })

        return twoFactorToken;
    } catch {
        return null;
    }
};