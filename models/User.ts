import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export default models.User || model("User", UserSchema);
