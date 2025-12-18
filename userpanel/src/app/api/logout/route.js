import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ success: true });

    response.cookies.set("token", "", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0, // 🔥 deletes cookie at server level
    });

    return response;
}
