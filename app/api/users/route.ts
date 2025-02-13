import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongo";
import User from "../../../models/User";

// ! Create User
export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
        }

        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, error: "This email is already in use" }, { status: 400 });
        }

        const newUser = await User.create({ username, email, password });

        return NextResponse.json({ success: true, user: newUser }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
