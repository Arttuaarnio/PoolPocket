import { OPENAI_API_KEY } from "react-native-dotenv";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function getPoolAdvice() {
  const prompt = `Prompt is going to be here`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    const advice = response.choices[0].message.content;
    return advice;
    
  } catch (error) {
    console.error("Error fetching pool advice:", error);
    throw error;
  }
}
