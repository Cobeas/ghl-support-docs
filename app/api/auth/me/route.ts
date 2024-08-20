import { cookies } from "next/headers";
import { COOKIE_NAME } from "../../../../lib/types/types";
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function GET() {
    const cookieStore = cookies();

    const token = cookieStore.get(COOKIE_NAME);
    console.log('Token:', token);

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        verify(token.value, process.env.JWT_SECRET || "");

        const response = { user: 'user with all his auth data' };

        return new Response(JSON.stringify(response), {
          status: 200,
        });
    } catch (error) {
        console.error((error as Error).message);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });
    }
}