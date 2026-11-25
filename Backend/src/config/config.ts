import dotenv from "dotenv"

dotenv.config()

const config = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    GROQ_API_KEY: process.env.GROQ_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || "",
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
    MONGODB_URL: process.env.MONGODB_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || ""
}

export default config