import { GoogleGenAI } from "@google/genai";

// Keep a single instance of the client, initialized lazily.
let ai: GoogleGenAI | null = null;

/**
 * Gets or creates the GoogleGenAI client instance.
 * Returns null if the API key is not available.
 */
const getAiClient = (): GoogleGenAI | null => {
  // Return the cached client if it exists
  if (ai) {
    return ai;
  }

  const API_KEY = process.env.API_KEY;

  // If the API key is not set, warn the developer and return null.
  if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API functionality will be disabled.");
    return null;
  }

  // Create and cache the client instance
  ai = new GoogleGenAI({ apiKey: API_KEY });
  return ai;
};

export async function getFunFact(): Promise<string> {
  const aiClient = getAiClient();
  
  // If the client could not be initialized (due to missing API key), return a helpful message.
  if (!aiClient) {
    return "Did you know? The API key is missing, so we can't fetch live facts right now!";
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Tell me a very short, interesting, and fun fact that is easy to understand.",
       config: {
         // Disable thinking for faster, simpler responses suitable for this use case.
         thinkingConfig: { thinkingBudget: 0 }
       }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from API");
    }
    return text.trim();
  } catch (error) {
    console.error("Error fetching fun fact from Gemini API:", error);
    return "Could not fetch a fun fact at the moment. Please try again later.";
  }
}
