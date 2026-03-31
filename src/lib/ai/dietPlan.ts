import { UserData } from "./types";
import { buildDietPrompt } from "./promptBuilder";
import { callGemini } from "./geminiClient";

export async function generateDietPlan(userData: UserData) {
  const prompt = buildDietPrompt(userData);

  const response = await callGemini([
    {
      role: "system",
      content: prompt.systemPrompt,
    },
    {
      role: "user",
      content: prompt.userPrompt,
    },
  ]);

  return response;
}
