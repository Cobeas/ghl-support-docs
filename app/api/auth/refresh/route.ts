import { sign, verify } from "jsonwebtoken";

export async function POST(request: Request) {
    const { refresh_token } = await request.json();

    if (!refresh_token) {
        return new Response(
            JSON.stringify({ message: 'Refresh token not provided' }),
            { status: 400 }
        );
    }

    try {
        const decoded = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET || "");
        console.log('Decoded:', decoded);
        //const newAccessToken = sign({ user: decoded.user }, process.env.JWT_SECRET || "", { expiresIn: process.env.JWT_EXPIRES_IN });
        return new Response(JSON.stringify({ access_token: decoded }), { status: 200 });
    } catch (error) {
        console.error((error as Error).message);
        return new Response(JSON.stringify({ message: 'Invalid refresh token' }), { status: 403 });
    }
}