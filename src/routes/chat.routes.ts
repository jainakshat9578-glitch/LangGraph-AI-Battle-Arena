import {Router} from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { chatController, getAllChatsController, deleteChatController } from "../controllers/chat.controllers.js"
import { sendMessageController, getConversationMessagesController } from "../controllers/message.controller.js"

const router = Router()

router.post("/create",authMiddleware,chatController)

router.post("/:conversationId/message",authMiddleware,sendMessageController)

router.get("/all",authMiddleware,getAllChatsController)

router.get("/:conversationId/messages",authMiddleware, getConversationMessagesController)

router.delete("/:conversationId",authMiddleware,deleteChatController)

export default router