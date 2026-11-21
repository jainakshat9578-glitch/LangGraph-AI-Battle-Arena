import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true //Extra whitespace remove karta hai
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        select: false
    }

}, {
    timestamps: true
});

// TypeScript type automatically infer karna
export type User = InferSchemaType<typeof userSchema>;
// Iska matlab TypeScript Mongoose schema ko dekhkar automatically User ka type generate kar dega.

const UserModel = model("User", userSchema);

export default UserModel;
