import { openai } from "@/lib/openai";
import { BaseService } from "./Base.service";
import { OPENAI_CONFIG } from "@/lib/constants";

export class OpenAIService extends BaseService {
  private static readonly SYSTEM_PROMPT = "You must respond with valid JSON only. No other text or explanation.";

  /**
   * Sends a request to OpenAI and returns the parsed JSON response
   * @param systemPrompt - The system prompt to guide the AI
   * @param messages - Array of user messages to send to the AI
   * @param defaultResponse - Default response if parsing fails
   * @returns Parsed JSON response from OpenAI
   */
  static async getJsonResponse<T>(
    systemPrompt: string,
    messages: string[],
    defaultResponse: T
  ): Promise<T> {
    return this.handleError(
      async () => {
        const formattedMessages = [
          {
            role: "system" as const,
            content: systemPrompt,
          },
          ...messages.map(message => ({
            role: "user" as const,
            content: message,
          })),
        ];

        const response = await openai.chat.completions.create({
          model: OPENAI_CONFIG.MODEL,
          messages: formattedMessages,
          max_tokens: OPENAI_CONFIG.MAX_TOKENS,
          temperature: OPENAI_CONFIG.TEMPERATURE,
          response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) {
          return defaultResponse;
        }

        return JSON.parse(content) as T;
      },
      "Failed to get or parse OpenAI response"
    );
  }
} 