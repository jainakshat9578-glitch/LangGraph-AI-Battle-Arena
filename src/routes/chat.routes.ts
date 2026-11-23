import {Router} from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { chatController } from "../controllers/chat.controllers.js"
import { sendMessageController } from "../controllers/message.controller.js"

const router = Router()

router.post("/create",authMiddleware,chatController)
router.post("/:conversationId/message",authMiddleware,sendMessageController)

export default router