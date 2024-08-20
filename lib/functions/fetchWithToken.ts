import { cookies } from "next/headers";
import { COOKIE_NAME, REFRESH_COOKIE_NAME } from "../types/types";
import { decode, verify } from "jsonwebtoken";

async function fetchWithToken(url: string, options: RequestInit = {}) {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME);

    if (!token || tokenExpired(token.value)) {
        const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME);
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken?.value }),
        });

        const data = await response.json();
        if (data.access_token) {
            const newToken = data.access_token;
            const newCookie = {
                name: COOKIE_NAME,
                value: newToken,
                options: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 30,
                }
            };
        }
    }
}

function tokenExpired(token: string) {
    const decoded: any = decode(token);
    const expTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const buffer = 1000 * 60 * 5; // 5 minutes
    return currentTime + buffer >= expTime;
}

export default fetchWithToken;