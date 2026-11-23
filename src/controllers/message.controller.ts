import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import chatModel from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { getWinningAnswer } from "./chat.controllers.js";
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

        const conversation = await chatModel.findOne({_id: conversationId,userId});

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        // Fetch previous conversation messages
        const previousMessages = await Message.find({
             conversationId
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
        
        // Restore chronological(old to new) order
       previousMessages.reverse();

       const chatHistory: {
    role: "user" | "assistant";
    content: string;
}[] = previousMessages
    .map((msg) => {

        if (msg.role === "user") {
            return {
                role: "user" as const, // exact literal type 
                content: String(msg.content)
            };
        }

        const winningAnswer = getWinningAnswer(msg.content);

        return {
            role: "assistant" as const, // exact literal type 
            content: winningAnswer
        };

    })
    .filter((msg) => msg.content.trim() !== "");

        const isFirstMessage =
    (await Message.countDocuments({ conversationId })) === 0;

        // Save user message in mongoDB
        const userMessage = await Message.create({
            conversationId,
            role: "user",
            content: message.trim()
        });

        // Run AI Battle
        const result = await graph(message.trim(), chatHistory);

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


// get a single chat by its id:
export const getConversationMessagesController = async (
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

        if (typeof conversationId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID"
            });
        }

        // Verify conversation ownership
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

        // Fetch all messages in chronological order
        const messages = await Message.find({
            conversationId
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            conversation,
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("Fetching messages failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
};
