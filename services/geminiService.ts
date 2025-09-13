import { GoogleGenAI } from "@google/genai";

// This is a browser-based application. It's assumed that the build environment 
// (like Vercel) will replace `process.env.API_KEY` with the actual secret.
// If `process` is not defined, it means the variable was not injected.
const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

let ai: GoogleGenAI | null;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (error) {
    console.error("Failed to initialize Gemini AI Client:", error);
    ai = null;
  }
} else {
  console.warn("Gemini API key is not available. The site owner needs to set the API_KEY environment variable in their deployment settings.");
  ai = null;
}


export async function getFunFact(): Promise<string> {
  if (!ai) {
    return "The Gemini API client is not initialized. The site owner needs to configure the API_KEY in the deployment environment.";
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
    if (error instanceof Error && error.message.includes('API key not valid')) {
       return "The provided API key is invalid. The site owner needs to check their configuration.";
    }
    return "Could not fetch a fun fact at the moment. Please try again later.";
  }
}
