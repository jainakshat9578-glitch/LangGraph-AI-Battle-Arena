import { type Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import chatModel from "../models/chat.model.js";


export const chatController = async (
    req: AuthenticatedRequest,
    res: Response
) => {

    try {

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const conversation = await chatModel.create({
            userId,
            chatTitle: "New Chat"
        });

        res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            conversation
        });

    } catch (error) {

        console.error("Conversation creation failed:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create conversation"
        });

    }
};