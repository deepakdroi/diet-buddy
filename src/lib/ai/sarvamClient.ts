export async function callSarvam(messages: any[]) {
  const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
    },
    body: JSON.stringify({
      model: "sarvam-m",
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Sarvam API Error: ${response.status}`);
  }

  const data = await response.json();

  return data?.choices?.[0]?.message?.content || "";
}
