import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";
import User from "@/models/User";

// ! Update Username
export async function POST(req: Request) {
    try {
        const { _id, newUsername } = await req.json();

        if (!_id || !newUsername) {
            return NextResponse.json({ success: false, error: "New username is required" }, { status: 400 });
        }

        await connectToDatabase();

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { username: newUsername },
            { new: true } // Return updated document
        );

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating username:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
