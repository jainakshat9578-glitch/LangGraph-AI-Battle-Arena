import express from "express"
import graph from "./ai/graph.ai.js"
import authRoutes from "./routes/auth.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import cookieParser from "cookie-parser"

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/chat",chatRoutes)

app.get("/", async (req, res) => {
    console.log("Battle request received...");

    try {
        console.log("Starting AI Battle...");

        const result = await graph(
            "Write a code for finding prime number in JavaScript?"
        );

        console.log("AI Battle completed successfully!");

        res.status(200).json({
            success: true,
            result
        });

    } catch (error) {
        console.error("AI Battle failed:", error);

        res.status(500).json({
            success: false,
            message: "AI Battle failed",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});


export default app