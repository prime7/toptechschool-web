export interface AIProvider {
  generateResponse(params: {
    prompt: string;
    model: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<{
    text: string;
    promptTokens: number;
    completionTokens: number;
    cost: number;
    time: number;
  }>
}

export interface AIConfig {
  apiKey: string;
  baseUrl?: string;
}