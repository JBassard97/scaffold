import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("password")) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        console.log("Hashed password before saving:", this.password);  // Log hashed password
    }

    next();
});

export default models.User || model("User", UserSchema);
