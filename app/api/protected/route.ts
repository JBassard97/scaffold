import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Protected data accessed", user: decoded });
}
