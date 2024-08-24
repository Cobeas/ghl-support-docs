import { NextResponse } from "next/server";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function GET() {
    const role = await currentRole();
    console.log("Role in API route", role);
    
    if (role === UserRole.ADMIN) {
        return new NextResponse(null, { status: 200 });
    }

    return new NextResponse(null, { status: 403 });
}

export async function POST() {
    return new NextResponse(null, { status: 403 });
}