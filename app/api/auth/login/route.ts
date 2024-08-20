import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { JWT_EXPIRES_IN, COOKIE_NAME } from "../../../../lib/types/types";

export async function POST(req: Request) {
  const body = await req.json();

  const { username, password } = body;

  // Check if the username and password are correct
  if(username !== 'admin' || password !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET || "";
  const expires = JWT_EXPIRES_IN;

  const token = sign(
    {
        expires_in: expires,
        expires_at: Date.now() + expires * 1000,
        user: {
            username: username,
            id: 'user_id_here',
            role: 'user_role_here',
            access: {
                canView: true,
                canEdit: false,
                canDelete: false,
            },
            settings: {
                theme: 'dark',
            }
        }
    },
    secret,
    {
        expiresIn: expires,
        issuer: process.env.JWT_ISSUER,
    }
  );

  const serialized = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  })

  const response = {
    message: 'Authenticated',
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Set-Cookie": serialized }
  });
}