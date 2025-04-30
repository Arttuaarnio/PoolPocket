import { OPENAI_API_KEY } from "react-native-dotenv";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const POOL_SYSTEM_PROMPT = `You are master billiards AI, an expert virtual assistant specialized in all aspects of pool and billiards.
You can answer questions about:
- Game rules for different pool variants (8-ball, 9-ball, snooker, straight pool, etc.)
- Professional techniques and strategies
- Famous players and tournaments
- Equipment advice (cues, tables, balls, etc.)
- Historical facts about the sport
- Etiquette and terminology
- Training drills and practice routines
- Shot mechanics and physics

Always be helpful, concise, and direct in your answers. If you're unsure about something, acknowledge that limitation rather than providing potentially incorrect information. Maintain a friendly and supportive tone. If someone asks something other than pool or billiards, politely redirect them to the topic at hand.`;

// Define message type for TypeScript
export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function getPoolAdvice(
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string> {
  try {
    // Prepare messages with system prompt and conversation history
    const messages: Message[] = [
      { role: "system", content: POOL_SYSTEM_PROMPT },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Return the response content
    return (
      response.choices[0].message.content || "I'm not sure how to answer that."
    );
  } catch (error) {
    console.error("Error fetching pool advice:", error);
    throw error;
  }
}
