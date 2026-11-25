import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        chatTitle: {
            type: String,
            default: "New Chat"
        }
    },
    {
        timestamps: true
    }
);

const chatModel = mongoose.model("Conversation",chatSchema);

export default chatModel;