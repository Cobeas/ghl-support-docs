import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import crypto from 'crypto';
import { getTwoFaTokenByEmail } from '@/data/twofa-token';

export const generateVerifyToken = async ( email: string ) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.verificationtoken.delete({
            where: {
                id: existingToken.id,
            }
        });
    }

    const verificationToken = await db.verificationtoken.create({
        data: {
            email,
            token,
            expires,
        }
    });

    return verificationToken;
}

export const generatePasswordResetToken = async ( email: string ) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await db.passwordresettoken.delete({
            where: {
                id: existingToken.id,
            }
        });
    }

    const passwordResetToken = await db.passwordresettoken.create({
        data: {
            email,
            token,
            expires,
        }
    });

    return passwordResetToken;
}

export const generateTwoFaToken = async ( email: string ) => {
    const token = crypto.randomInt(100000, 1000000).toString();
    const expires = new Date(new Date().getTime() + 600 * 1000); // 10 minutes

    const existingToken = await getTwoFaTokenByEmail(email);

    if (existingToken) {
        await db.twofactortoken.delete({
            where: {
                id: existingToken.id,
            }
        });
    }

    const twoFaToken = await db.twofactortoken.create({
        data: {
            email,
            token,
            expires,
        }
    });

    return twoFaToken;
}