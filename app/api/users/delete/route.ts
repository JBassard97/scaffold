// app/api/users/delete/route.ts

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
