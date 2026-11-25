import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },

        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true
        },

        content: {
            type: Schema.Types.Mixed, //Mixed->content me string bhi or object bhi store krskte hai!
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message",messageSchema);

export default Message;