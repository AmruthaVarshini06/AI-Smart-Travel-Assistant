declare module "groq-sdk" {
  export interface GroqConfig {
    apiKey: string;
    dangerouslyAllowBrowser?: boolean;
  }

  export interface GroqChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
  }

  export interface GroqChatCompletionChoice {
    message?: {
      content?: string;
    };
  }

  export interface GroqChatCompletions {
    create(options: {
      model: string;
      messages: GroqChatMessage[];
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
    }): Promise<{ choices: GroqChatCompletionChoice[] }>;
  }

  export class Groq {
    constructor(config: GroqConfig);
    chat: {
      completions: GroqChatCompletions;
    };
  }

  export default Groq;
}
