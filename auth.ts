import NextAuth, { type DefaultSession } from "next-auth"
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { UserRole } from "@prisma/client";
import { getTwoFaConfirmationByUserId } from "./data/twofa-confirmation";
import Resend from "next-auth/providers/resend";

declare module "next-auth" {
    interface Session {
        user: {
        role: UserRole
        isTwoFa: boolean
        } & DefaultSession["user"]
    }
}

const combinedProviders = [
    ...authConfig.providers,
    Resend({
        apiKey: process.env.RESEND_API_KEY,
        from: "support@testmail.cobeas.nl",
    })
]

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    trustHost: true,
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "credentials") {
                const existingUser = await getUserById(user.id!);

                if (!existingUser?.emailVerified) return false;

                if (existingUser.istwofa) {
                    const twoFactorConfirmation = await getTwoFaConfirmationByUserId(existingUser.id);

                    if (!twoFactorConfirmation) {
                        return false;
                    }

                    await db.twoFactorConfirm.delete({ where: { id: twoFactorConfirmation.id } });
                }
            }
            return true;
        },
        async session({ token, session }) {

            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role;
            }

            if (token.isTwoFa && session.user) {
                session.user.isTwoFa = token.isTwoFa as boolean;
            }

            if (token.name && session.user) {
                session.user.name = token.name;
            }

            if (token.email && session.user) {
                session.user.email = token.email;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            token.role = existingUser.role;
            token.isTwoFa = existingUser.istwofa;
            token.name = existingUser.name;
            token.email = existingUser.email;
            return token;
        }
    },
    pages: {
        signIn: "/auth/login",
        verifyRequest: "/auth/verify-request",
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    providers: combinedProviders,
})