import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function GET(req: Request) {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.split("; ").find((c) => c.startsWith("token="))?.slice(6);

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = verify(token, process.env.JWT_KEY!);
        return NextResponse.json({ user: decoded });
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}