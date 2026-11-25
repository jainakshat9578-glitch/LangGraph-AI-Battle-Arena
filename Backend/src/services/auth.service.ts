import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken"

interface RegisterData {
    name: string;
    email: string;
    password: string;
}


export const registerUser = async (data: RegisterData) => {

    const email = data.email.trim().toLowerCase();

    // Check whether email already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user in MongoDB
    const user = await UserModel.create({
        name: data.name.trim(),
        email,
        password: hashedPassword
    });

    // Never return the password
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    };
};

export const loginUser = async (email: string, password: string) => {

    const normalizedEmail = email.trim().toLowerCase();

    // Find user and explicitly include password
    const user = await UserModel
        .findOne({ email: normalizedEmail })
        .select("+password");

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password,user.password);

    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    if (!config.JWT_SECRET) {
        throw new Error("JWT_SECRET_MISSING");
    }

    const token = jwt.sign(
        { userId: user._id.toString() },
        config.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        token,
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email
        }
    };
};