import { GoogleGenAI } from "@google/genai";

// Safely access the API key from environment variables.
// This prevents a crash in browser environments where `process` is not defined.
const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize Gemini AI Client:", error);
    ai = null;
  }
} else {
  console.warn("Gemini API key is not available in environment variables.");
}


export async function getFunFact(): Promise<string> {
  // If the client has not been initialized, return a helpful message.
  if (!ai) {
    return "Did you know? The Gemini API key is not configured. The site owner needs to set it up in the Vercel environment variables.";
  }

  try {
    const response = await ai.models.generateContent({
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
    // Provide a more specific error if it's an authentication issue
    if (error instanceof Error && error.message.includes('API key not valid')) {
       return "The API key configured on the server is invalid.";
    }
    return "Could not fetch a fun fact at the moment. Please try again later.";
  }
}