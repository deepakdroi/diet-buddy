import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function callGemini(messages: any[]) {
  try {
    const systemText = messages.find((m) => m.role === "system")?.content || "";
    const userMessages = messages.filter((m) => m.role !== "system");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: systemText }], // <-- This fixes the 400 Bad Request
      },
    });

    const formattedHistory = userMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = formattedHistory.pop();
    if (!lastMessage) throw new Error("No user message found to send.");

    // Start chat with history
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    const result = await chat.sendMessage(lastMessage?.parts[0].text);

    return result.response.text();
  } catch (error: any) {
    console.error("Gemini Execution Error:", error);
    throw error;
  }
}
