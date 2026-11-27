export type ModelId = 'groq' | 'cohere' | 'nemotron'

export type ModelStatus = 'success' | 'failed' | 'not_selected'

export interface ConversationSummary {
  id: string
  title: string
}

export interface ChatHistoryEntry {
  role: 'user' | 'assistant'
  content: string
}

export interface JudgeEvaluation {
  modelId: ModelId
  modelName: string
  score: number
  reasoning: string
}

export interface BattleResult {
  problem: string
  chatHistory: ChatHistoryEntry[]
  selectedModels: ModelId[]
  solution_1: string
  solution_2: string
  solution_3: string
  solution_1_status: ModelStatus
  solution_2_status: ModelStatus
  solution_3_status: ModelStatus
  judge: {
    evaluations: JudgeEvaluation[]
  }
  judge_status: 'pending' | 'success' | 'unavailable'
  winner: string
  winner_score: number
  winner_status: 'pending' | 'success' | 'tie' | 'unavailable'
}

export interface UserMessage {
  _id: string
  conversationId: string
  role: 'user'
  content: string
  createdAt: string
  updatedAt: string
}

export interface AssistantMessage {
  _id: string
  conversationId: string
  role: 'assistant'
  content: BattleResult
  createdAt: string
  updatedAt: string
}
