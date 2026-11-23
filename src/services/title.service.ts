
import { ChatGroq } from "@langchain/groq";
import config from "../config/config.js";

const titleModel = new ChatGroq({
    model: "openai/gpt-oss-20b",
    apiKey: config.GROQ_API_KEY,
    temperature: 0.3
});

const generateChatTitle = async (message: string): Promise<string> => {
    const response = await titleModel.invoke([
        {
            role: "system",
            content: `Generate a short, meaningful chat title
            based on the user's message.
            Keep it under 8 words.
            Return only the title, without quotes.`
        },
        {
            role: "user",
            content: message
        }
    ]);

    return String(response.content).trim().replace(/^["']|["']$/g, "");
};

export default generateChatTitle;
