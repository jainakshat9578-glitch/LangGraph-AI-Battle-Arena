import mongoose from "mongoose";
import { type Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import chatModel from "../models/chat.model.js";
import Message from "../models/message.model.js";


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


export const getAllChatsController = async (
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

        const conversations = await chatModel
            .find({ userId })
            .sort({ updatedAt: -1 }) // last vali chat sabse upr 
            .select("_id chatTitle createdAt updatedAt"); // yehi return krna baaki kuch nhi

        return res.status(200).json({
            success: true,
            count: conversations.length,
            conversations
        });

    } catch (error) {
        console.error("Fetching chats failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch conversations"
        });
    }
};


export const deleteChatController = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const userId = req.user?.userId;
        const conversationId = req.params.conversationId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (
            typeof conversationId !== "string" ||
            !mongoose.isValidObjectId(conversationId) //MongoDB ID valid format mein hai ya nahi check karta hai.
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID"
            });
        }

        const conversation = await chatModel.findOne({
            _id: conversationId,
            userId
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        // 4. Delete all related messages
        await Message.deleteMany({
            conversationId
        });

        // 5. Delete conversation
        await chatModel.deleteOne({
            _id: conversationId,
            userId
        });

        return res.status(200).json({
            success: true,
            message: "Conversation deleted successfully"
        });

    } catch (error) {
        console.error("Chat deletion failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete conversation"
        });
    }
};

export const getWinningAnswer = (result: any): string => {

    switch (result?.winner) {

        case "Groq":
            return result.solution_1 || "";

        case "Cohere":
            return result.solution_2 || "";

        case "Nemotron":
            return result.solution_3 || "";

        default:
            return "";
    }
};

