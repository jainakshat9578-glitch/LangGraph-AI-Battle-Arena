import {StateGraph, StateSchema, START, END, type GraphNode, type CompiledStateGraph} from "@langchain/langgraph"
import z from "zod"
import { groqModel, cohereModel, geminiModel, openRouterModel } from "./model.ai.js"
import { createAgent, HumanMessage, providerStrategy } from "langchain"

/**
 * StateSchema->data jo nodes aapas me share kr rhe hai uss data ka format kya hoga voh isme define krte hai
 * Promise.all -> Saari promises ko ek saath execute karo, lekin agar ek bhi promise fail ho gayi, toh poora Promise.all() reject ho jayega.
 * Promise.allSettled -> Saari promises complete hone ka wait karo, chahe success ho ya failure.
 */

const state = new StateSchema({
    problem: z.string().default(""),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    solution_3: z.string().default(""),
    solution_1_status: z.string().default("pending"),
    solution_2_status: z.string().default("pending"),
    solution_3_status: z.string().default("pending"),
    judge: z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_3_score: z.number().default(0),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default(""),
        solution_3_reasoning: z.string().default(""),
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

    const results = await Promise.allSettled([

        invokeWithTimeout(
            "Groq",
            () => groqModel.invoke(state.problem)
        ),
       
        invokeWithTimeout(
            "Cohere",
            () => cohereModel.invoke(state.problem)
        ),

        invokeWithTimeout(
            "Nemotron",
            () => openRouterModel.invoke(state.problem)
        )

    ]);

    const getResult = (result: typeof results[number]) => {
        if (result.status === "fulfilled") {
            return result.value;
        }

        return {
            status: "failed" as const,
            solution: ""
        };
    };

    const groq = getResult(results[0]);
    const cohere = getResult(results[1]);
    const nemotron = getResult(results[2]);

    return {
        solution_1: groq.solution,
        solution_2: cohere.solution,
        solution_3: nemotron.solution,

        solution_1_status: groq.status,
        solution_2_status: cohere.status,
        solution_3_status: nemotron.status
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
        solution_1,
        solution_2,
        solution_3,
        solution_1_status,
        solution_2_status,
        solution_3_status
    } = state;

    // Check whether at least one model generated a solution
    const availableSolutions = [
        solution_1_status === "success",
        solution_2_status === "success",
        solution_3_status === "success"
    ];

    if (!availableSolutions.some(Boolean)) {
        return {
            judge_status: "unavailable"
        };
    }

    try {

        const judge = createAgent({
            model: geminiModel,

            responseFormat: providerStrategy(z.object({
                solution_1_score: z.number().min(0).max(10),
                solution_2_score: z.number().min(0).max(10),
                solution_3_score: z.number().min(0).max(10),

                solution_1_reasoning: z.string(),
                solution_2_reasoning: z.string(),
                solution_3_reasoning: z.string()
            })),

            systemPrompt: `You are an impartial AI judge.

            Evaluate solutions based on:
            1. Correctness
            2. Code quality
            3. Efficiency
            4. Completeness

            Give each available solution an independent score between 0 and 10.

            If a solution is unavailable, give it score 0
            and explain that the model failed.

            Provide clear reasoning for every score.
            Do not favor any particular AI model.`
        });

        const judgeResponse = await judge.invoke({
            messages: [
                new HumanMessage(`
                    Problem: ${problem}

                    Solution 1: ${solution_1 || "Unavailable"}
                    Solution 2: ${solution_2 || "Unavailable"}
                    Solution 3: ${solution_3 || "Unavailable"}

                    Evaluate the available solutions.
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
            judge_status: "unavailable"
        };
    }
};

const winnerNode: GraphNode<typeof state> = async (state) => {

    // Judge unavailable hai toh winner declare nahi kar sakte
    if (state.judge_status !== "success") {
        return {
            winner: "Not declared",
            winner_score: 0,
            winner_status: "unavailable"
        };
    }

    const solutions = [
        {
            name: "Groq",
            score: state.judge.solution_1_score,
            status: state.solution_1_status
        },
        {
            name: "Cohere",
            score: state.judge.solution_2_score,
            status: state.solution_2_status
        },
        {
            name: "Nemotron",
            score: state.judge.solution_3_score,
            status: state.solution_3_status
        }
    ];

    // Failed models ko competition se remove karna
    const validSolutions = solutions.filter(
        (solution) => solution.status === "success"
    );

    if (validSolutions.length === 0) {
        return {
            winner: "No valid solutions",
            winner_score: 0,
            winner_status: "unavailable"
        };
    }

    // Highest score find karna
    const highestScore = Math.max(
        ...validSolutions.map((solution) => solution.score)
    );

    // Highest score wale models find karna
    const winners = validSolutions.filter(
        (solution) => solution.score === highestScore
    );// .filter()->always return array!

    // Tie condition
    if (winners.length > 1) {
        return {
            winner: "Tie",
            winner_score: highestScore,
            winner_status: "tie"
        };
    }

    const winner = winners[0];

    if (!winner) {
    return {
        winner: "Not declared",
        winner_score: 0,
        winner_status: "unavailable"
    };
}

    return {
    winner: winner.name,
    winner_score: winner.score,
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

export default async function runGraph(problem:string){
    
    const result = await graph.invoke({
        problem: problem // graph ko problem ke sath invoke krenege kyuki solutionNode ko problem hi chahiye
    })

    return result
}    