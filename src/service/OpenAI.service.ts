import { openai } from "@/lib/openai";

export class OpenAIService {
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
    try {
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
        model: "gpt-4o-mini",
        messages: formattedMessages,
        max_tokens: 10000,
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        return defaultResponse;
      }

      return JSON.parse(content) as T;
    } catch (e) {
      console.error("Failed to get or parse OpenAI response:", e);
      return defaultResponse;
    }
  }
} 