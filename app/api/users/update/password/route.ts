import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";
import User from "@/models/User";

// ! Update Password
export async function POST(req: Request) {
    try {
        const { _id, newPassword } = await req.json();

        if (!_id || !newPassword) {
            return NextResponse.json({ success: false, error: "New password is required" }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findById(_id);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        user.password = newPassword; // Mongoose will hash it via the save method
        await user.save();

        return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
