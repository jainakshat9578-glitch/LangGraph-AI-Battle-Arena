import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import chatModel from "../models/chat.model.js";
import Message from "../models/message.model.js";
import graph from "../ai/graph.ai.js";
import generateChatTitle from "../services/title.service.js";

export const sendMessageController = async (
    req: AuthenticatedRequest,
    res: Response
) => {

    try {

        const userId = req.user?.userId;
        const { message } = req.body;
        const conversationId = req.params.conversationId;

        if (typeof conversationId !== "string") {
          return res.status(400).json({
             success: false,
             message: "Invalid conversation ID"
           });
        }
        

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // Verify conversation ownership
        const conversation = await chatModel.findOne({_id: conversationId,userId});

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        const isFirstMessage =
    (await Message.countDocuments({ conversationId })) === 0;

        // Save user message in mongoDB
        const userMessage = await Message.create({
            conversationId,
            role: "user",
            content: message.trim()
        });

        // Run AI Battle
        const result = await graph(message.trim());

        // Save complete AI Battle result in mongoDB
        const assistantMessage = await Message.create({
            conversationId,
            role: "assistant",
            content: result
        });

        // Generate title only for the first message
 if (isFirstMessage) {
    try {
        const title = await generateChatTitle(message.trim());

        conversation.chatTitle = title;
        await conversation.save();

    } catch (error) {
        console.error("Title generation failed:", error);
    }
}

        // Update conversation activity
        conversation.updatedAt = new Date();
        await conversation.save();

        res.status(200).json({
            success: true,
            userMessage,
            assistantMessage
        });

    } catch (error) {

        console.error("Message processing failed:", error);

        res.status(500).json({
            success: false,
            message: "Failed to process message"
        });

    }
};