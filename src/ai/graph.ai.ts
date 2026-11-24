import {StateGraph, StateSchema, START, END, type GraphNode, type CompiledStateGraph} from "@langchain/langgraph"
import z from "zod"
import { groqModel, cohereModel, geminiModel, openRouterModel } from "./model.ai.js"
import { createAgent, HumanMessage, AIMessage, providerStrategy } from "langchain"

/**
 * StateSchema->data jo nodes aapas me share kr rhe hai uss data ka format kya hoga voh isme define krte hai
 * Promise.all -> Saari promises ko ek saath execute karo, lekin agar ek bhi promise fail ho gayi, toh poora Promise.all() reject ho jayega.
 * Promise.allSettled -> Saari promises complete hone ka wait karo, chahe success ho ya failure.
 */

const state = new StateSchema({
    problem: z.string().default(""),
    chatHistory: z.array(z.object({role: z.enum(["user", "assistant"]),content: z.string()})).default([]),
    selectedModels: z.array(z.enum(["groq","cohere","nemotron"])).length(2),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    solution_3: z.string().default(""),
    solution_1_status: z.string().default("pending"),
    solution_2_status: z.string().default("pending"),
    solution_3_status: z.string().default("pending"),
    judge: z.object({
        evaluations: z.array(
            z.object({
                modelId: z.enum(["groq","cohere","nemotron"]),
                modelName: z.string(),
                score: z.number(),
                reasoning: z.string()            
            })
        ).default([])
    }),
    judge_status: z.string().default("pending"),
    winner: z.string().default("Not declared"),
    winner_score: z.number().default(0),
    winner_status: z.string().default("pending")
})

// const solutionNode: GraphNode< typeof state> = async(state)=>{

//     //Promise.all() — dono models ko parallel run karwana.
//     const [groqResponse, cohereResponse, nemotronResponse] = await Promise.all([
//         groqModel.invoke(state.problem),
//         cohereModel.invoke(state.problem),
//         openRouterModel.invoke(state.problem)
//     ])

//     return {
//         solution_1: groqResponse.text,
//         solution_2: cohereResponse.text,
//         solution_3: nemotronResponse.text
//     }
// }



const solutionNode: GraphNode<typeof state> = async (state) => {

    const models = {
        groq: {
            name: "Groq",
            model: groqModel
        },
        cohere: {
            name: "Cohere",
            model: cohereModel
        },
        nemotron: {
            name: "Nemotron",
            model: openRouterModel
        }
    };

    // Previous conversation + current question
    const conversationMessages = [
        ...state.chatHistory.map((msg) => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content);
            }

            return new AIMessage(msg.content);
        }),
        new HumanMessage(state.problem)
    ];

    // Model execution with timeout and retry
    const invokeWithTimeout = async (
        name: string,
        request: () => Promise<any>
    ) => {
        const maxRetries = 1;

        for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {

            console.log(`${name} started... Attempt ${attempt}`);

            let timeout: ReturnType<typeof setTimeout> | undefined;

            try {
                const response = await Promise.race([
                    request(),

                    new Promise<never>((_, reject) => {
                        timeout = setTimeout(() => {
                            reject(new Error(`${name} timed out after 30 seconds`));
                        }, 30000);
                    })
                ]);

                console.log(`${name} completed successfully!`);

                return {
                    status: "success" as const,
                    solution: response.text
                };

            } catch (error) {
                console.error(`${name} failed on attempt ${attempt}:`, error);

                if (attempt <= maxRetries) {
                    console.log(`Retrying ${name}...`);
                }

            } finally {
                if (timeout) clearTimeout(timeout);
            }
        }

        return {
            status: "failed" as const,
            solution: ""
        };
    };

    // Define result structure
    type ModelId = keyof typeof models; // modelId only accept cohere,groq,nemotron

    type ModelResult = {
        status: "success" | "failed" | "not_selected";
        solution: string;
    };

    const modelResults: Record<ModelId, ModelResult> = {
        groq: {
            status: "not_selected",
            solution: ""
        },
        cohere: {
            status: "not_selected",
            solution: ""
        },
        nemotron: {
            status: "not_selected",
            solution: ""
        }
    };

    // Execute only selected models
    const selectedResults = await Promise.all(
        state.selectedModels.map(async (modelId) => {

            const selectedModel = models[modelId];

            const result = await invokeWithTimeout(
                selectedModel.name,
                () => selectedModel.model.invoke(conversationMessages)
            );

            return {
                modelId,
                result
            };
        })
    );

    // Store results against their model IDs
    selectedResults.forEach(({ modelId, result }) => {
        modelResults[modelId] = result;
    });

    // Return results in existing graph format
    return {
        solution_1: modelResults.groq.solution,
        solution_2: modelResults.cohere.solution,
        solution_3: modelResults.nemotron.solution,

        solution_1_status: modelResults.groq.status,
        solution_2_status: modelResults.cohere.status,
        solution_3_status: modelResults.nemotron.status
    };
};


// const judgeNode: GraphNode<typeof state> = async(state)=>{

//     const {problem,solution_1,solution_2, solution_3} = state

//     const judge = createAgent({
//         model: geminiModel,
//         responseFormat: providerStrategy(z.object({
//             solution_1_score: z.number().min(0).max(10),
//             solution_2_score: z.number().min(0).max(10),
//             solution_3_score: z.number().min(0).max(10),
//             solution_1_reasoning: z.string(),
//             solution_2_reasoning: z.string(),
//             solution_3_reasoning: z.string(),
//         })),
//          systemPrompt: ` You are an impartial AI judge.

//             You will evaluate three solutions to the same problem.

//             Evaluate each solution based on:
//             1. Correctness
//             2. Code quality
//             3. Efficiency
//             4. Completeness

//             Give each solution an independent score between 0 and 10.

//             Provide clear reasoning for every score.

//             Do not favor any particular AI model.`
//     })

//     const judgeResponse = await judge.invoke({
//          messages: [
//             new HumanMessage(`
//                 Problem: ${problem}
//                 Solution 1: ${solution_1}
//                 Solution 2: ${solution_2}
//                 Solution 3: ${solution_3}
//                 Please evaluate the solutions and provide scores and reasoning.
//                 `)
//         ]
//     })

//     const {
//         solution_1_score,
//         solution_2_score,
//         solution_3_score,
//         solution_1_reasoning,
//         solution_2_reasoning,
//         solution_3_reasoning
//     } = judgeResponse.structuredResponse

//     return {
//         judge: {
//              solution_1_score,
//              solution_2_score,
//              solution_3_score,
//              solution_1_reasoning,
//              solution_2_reasoning,
//              solution_3_reasoning
//         }
//     }
// }


const judgeNode: GraphNode<typeof state> = async (state) => {

    const {
        problem,
        chatHistory,
        selectedModels,
        solution_1,
        solution_2,
        solution_3,
        solution_1_status,
        solution_2_status,
        solution_3_status
    } = state;

    const modelSolutions = [
    {
        modelId: "groq" as const, //read-Only
        modelName: "Groq",
        solution: solution_1,
        status: solution_1_status
    },
    {
        modelId: "cohere" as const,
        modelName: "Cohere",
        solution: solution_2,
        status: solution_2_status
    },
    {
        modelId: "nemotron" as const,
        modelName: "Nemotron",
        solution: solution_3,
        status: solution_3_status
    }
];

const successfulSolutions = modelSolutions.filter(
    (item) =>
        selectedModels.includes(item.modelId) &&
        item.status === "success" &&
        item.solution.trim() !== ""
);

    if (successfulSolutions.length === 0) {
    return {
        judge_status: "unavailable",
        judge: { evaluations: [] }
    };
}

if (successfulSolutions.length === 1) {
    return {
        judge_status: "skipped",
        judge: { evaluations: [] }
    };
}

    const formattedHistory = chatHistory
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

    const formattedSolutions = successfulSolutions
    .map((item, index) => `
        Model ${index + 1}: ${item.modelName}
        Model ID: ${item.modelId}
        Solution:
        ${item.solution}
    `)
    .join("\n\n"); // saare messages ko newline se combine krta hai!

    try {

        const judge = createAgent({
            model: geminiModel,

            responseFormat: providerStrategy(z.object({
                evaluations: z.array(
                    z.object({
                        modelId: z.enum(["groq","cohere","nemotron"]),
                        modelName: z.string(),
                        score: z.number().min(0).max(10),
                        reasoning: z.string()
                    })
                )
            })),

            systemPrompt: `You are an impartial AI judge.
                Evaluate only the solutions provided in the user message.

                Evaluation criteria:
                1. Correctness
                2. Code quality
                3. Efficiency
                4. Completeness

                Rules:
                - Give each solution an independent score between 0 and 10.
                - Provide clear reasoning for every score.
                - Do not invent models or solutions.
                - Do not favor any particular AI provider.
                - Return exactly one evaluation for each provided model.
                - Use the exact modelId and modelName provided.`
});

        const judgeResponse = await judge.invoke({
            messages: [
                new HumanMessage(`
    Previous Conversation:
    ${formattedHistory || "No previous conversation"}
    Current Problem: ${problem}
    Solutions to Evaluate:
    ${formattedSolutions}
    Evaluate all provided solutions considering the previous converstaion wherever relevant.
    Return the exactly one evaluation for each provided model.
`)
            ]
        });

        return {
            judge: judgeResponse.structuredResponse,
            judge_status: "success"
        };

    } catch (error) {

        console.error("Gemini Judge failed:", error);

        return {
            judge_status: "unavailable",
            judge:{
                evaluations: []
            }
        };
    }
};


const winnerNode: GraphNode<typeof state> = async (state) => {

    const {
        judge,
        judge_status,
        solution_1_status,
        solution_2_status,
        solution_3_status
    } = state;

    // All model statuses with their IDs
    const modelStatuses = [
        { modelId: "groq", status: solution_1_status },
        { modelId: "cohere", status: solution_2_status },
        { modelId: "nemotron", status: solution_3_status }
    ];

    //Find successfully completed models
    const successfulModels = modelStatuses.filter(
        (item) => item.status === "success"
    );

    if (successfulModels.length === 0) {
        return {
            winner: "No winner",
            winner_score: 0,
            winner_status: "unavailable"
        };
    }

    // Only one model succeeded
    // No need to call Gemini Judge
    if (successfulModels.length === 1) {

        const winningModel = successfulModels[0];

        if (!winningModel) {
            return {
                winner: "No winner",
                winner_score: 0,
                winner_status: "unavailable"
            };
        }

        const modelNames: Record<string, string> = {
            groq: "Groq",
            cohere: "Cohere",
            nemotron: "Nemotron"
        };

        return {
            winner: modelNames[winningModel.modelId] ?? "Unknown",
            winner_score: 0,
            winner_status: "success"
        };
    }

    if (judge_status !== "success") {
        return {
            winner: "No winner",
            winner_score: 0,
            winner_status: "unavailable"
        };
    }

    //Match evaluations with successful models
    const validEvaluations = judge.evaluations.filter(
        (evaluation) =>
            successfulModels.some(
                (model) => model.modelId === evaluation.modelId
            )
    );
    //some()->Ye check karta hai ki successfulModels array mein kam se kam ek matching model ID hai ya nahi.

    // Ensure we have valid evaluations
    const uniqueEvaluations = validEvaluations.filter(
        (evaluation, index, self) =>
            self.findIndex(
                (item) => item.modelId === evaluation.modelId
            ) === index
    );

    //Check whether every successful model was evaluated
if (uniqueEvaluations.length !== successfulModels.length) {
    return {
        winner: "No winner",
        winner_score: 0,
        winner_status: "unavailable"
    };
}    

    //Validate evaluation scores
const hasInvalidScore = uniqueEvaluations.some(
    (item) =>
        !Number.isFinite(item.score) ||
        item.score < 0 ||
        item.score > 10
);

if (hasInvalidScore) {
    return {
        winner: "No winner",
        winner_score: 0,
        winner_status: "unavailable"
    };
}

    if (uniqueEvaluations.length === 0) {
        return {
            winner: "No winner",
            winner_score: 0,
            winner_status: "unavailable"
        };
    }

    const highestScore = Math.max(
        ...uniqueEvaluations.map((item) => item.score)
    );

    const winners = uniqueEvaluations.filter(
        (item) => item.score === highestScore
    );

    //Handle tie
    if (winners.length > 1) {
        return {
            winner: "Tie",
            winner_score: highestScore,
            winner_status: "tie"
        };
    }

    //Declare winner
    const winningModel = winners[0];

    if (!winningModel) {
        return {
            winner: "No winner",
            winner_score: 0,
            winner_status: "unavailable"
        };
    }

    return {
        winner: winningModel.modelName,
        winner_score: winningModel.score,
        winner_status: "success"
    };
};



/**
 * .addNode-> create nodes
 * .addEdge-> make connection between nodes
 */
const graph = new StateGraph(state)
    .addNode("solution",solutionNode)
    .addNode("judge_node",judgeNode)
    .addNode("winner_node", winnerNode)
    .addEdge(START, "solution")
    .addEdge("solution","judge_node")
    .addEdge("judge_node","winner_node")
    .addEdge("winner_node", END)
    .compile() // graph banane ke baad usko compile krna padta hai verna use nhi kr payenge

type ChatHistoryMessage = {
    role: "user" | "assistant";
    content: string;
};

type SelectedModel = "groq" | "cohere" | "nemotron";

export default async function runGraph(problem:string,selectedModels: SelectedModel[],chatHistory: ChatHistoryMessage[]=[]){
    
    const result = await graph.invoke({
        problem, // graph ko problem ke sath invoke krenege kyuki solutionNode ko problem hi chahiye
        chatHistory,
        selectedModels
    })

    return result
}    