import express from "express"
import graph from "./ai/graph.ai.js"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)

app.get("/",async(req,res)=>{
     
    const result = await graph("write a code for factorial function in js")

    res.json(result)
})


export default app