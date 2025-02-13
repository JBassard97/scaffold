import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongo";
import User from "../../../models/User";

export async function POST(req: Request) {
    try {
        const { username, email } = await req.json();
        

        await connectToDatabase();
        const newUser = await User.create({ username, email });

        return NextResponse.json({ success: true, user: newUser }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
