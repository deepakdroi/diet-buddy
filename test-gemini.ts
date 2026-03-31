import * as dotenv from "dotenv";

// Force load the .env file
dotenv.config();

async function rawApiTest() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ ERROR: Key is missing.");
    return;
  }

  // Prove we are using the new key (prints first 10 characters only)
  console.log(`🔑 Loaded Key: ${apiKey.substring(0, 10)}...`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  console.log("⏳ Sending raw request to Google...");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Reply with the word SUCCESS" }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
      console.error(
        "Google's exact response:",
        JSON.stringify(errorData, null, 2),
      );
      return;
    }

    const data = await response.json();
    console.log("✅ RAW API SUCCESS!");
    console.log(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("❌ Network execution failed:", error);
  }
}

rawApiTest();
