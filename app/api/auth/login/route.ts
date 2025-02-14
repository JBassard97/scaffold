import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "../../../../lib/mongo";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
        }

        await connectToDatabase();

        // Find user by email
        const user = await User.findOne({ email }).lean() as unknown as { _id: string, email: string, password: string };  // Using lean() for plain JS object
        if (!user) {
            console.log("User not found for email:", email);
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        // Diagnostic logging
        console.log("Incoming password type:", typeof password);
        console.log("Incoming password length:", password.length);
        console.log("DB password type:", typeof user.password);
        console.log("DB password length:", user.password.length);

        // Ensure we're working with strings
        const cleanPassword = String(password);
        const cleanHashedPassword = String(user.password);

        // Test hash generation (for debugging)
        const testHash = await bcrypt.hash(cleanPassword, 10);
        console.log("Test hash length:", testHash.length);

        // Compare passwords
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(cleanPassword, cleanHashedPassword);
            console.log("Password comparison result:", isMatch);
        } catch (bcryptError) {
            console.error("bcrypt.compare error:", bcryptError);
            return NextResponse.json({ success: false, error: "Authentication error" }, { status: 500 });
        }

        if (!isMatch) {
            console.log("Password mismatch");
            // For debugging only - remove in production:
            console.log("Failed match details:", {
                providedPassword: cleanPassword,
                hashedPasswordLength: cleanHashedPassword.length,
                sampleNewHash: testHash
            });
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id.toString(), // Ensure ID is a string
                email: user.email
            },
            process.env.JWT_SECRET as string,
            // { expiresIn: "7h" }
        );

        // Remove password from user object before sending
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            token,
            user: userWithoutPassword
        }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({
            success: false,
            error: "An error occurred during login"
        }, { status: 500 });
    }
}