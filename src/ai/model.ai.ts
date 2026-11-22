import { ChatGoogle } from "@langchain/google";
import { ChatCohere } from "@langchain/cohere";
import { ChatGroq } from "@langchain/groq";
import {ChatOpenRouter} from "@langchain/openrouter"
import { ChatOpenAI } from "@langchain/openai";
import config from "../config/config.js";


export const geminiModel = new ChatGoogle({
    model: "gemini-3.6-flash",
    apiKey: config.GOOGLE_API_KEY
})

export const groqModel = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: config.GROQ_API_KEY
})

export const cohereModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.COHERE_API_KEY
})

export const openRouterModel = new ChatOpenRouter({
    model: "nvidia/nemotron-3-ultra-550b-a55b:free",
    apiKey: config.OPENROUTER_API_KEY,
    temperature: 0.7
})

