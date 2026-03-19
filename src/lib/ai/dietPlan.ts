import { UserData } from "./types";
import { buildDietPrompt } from "./promptBuilder";
import { callSarvam } from "./sarvamClient";

export async function generateDietPlan(userData: UserData) {
  const prompt = buildDietPrompt(userData);

  const response = await callSarvam([
    {
      role: "system",
      content: "You are an expert Indian dietician.",
    },
    {
      role: "user",
      content: prompt,
    },
  ]);

  return response;
}
