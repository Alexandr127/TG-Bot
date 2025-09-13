
import { GoogleGenAI } from "@google/genai";

// Keep a single instance of the client.
let ai: GoogleGenAI | null = null;

/**
 * Initializes the GoogleGenAI client with a user-provided API key.
 * @param apiKey The API key to use for initialization.
 */
export const initializeAiClient = (apiKey: string): void => {
  if (!apiKey) {
    console.warn("Attempted to initialize AI client with an empty API key.");
    ai = null; // Reset if key is invalid
    return;
  }
  // Create and cache the client instance
  try {
    ai = new GoogleGenAI({ apiKey });
    console.log("Gemini AI Client initialized successfully.");
  } catch(error) {
    console.error("Failed to initialize Gemini AI Client:", error);
    ai = null;
  }
};

export async function getFunFact(): Promise<string> {
  // If the client has not been initialized, return a helpful message.
  if (!ai) {
    return "Did you know? The Gemini API key is missing. Please add it in the settings to get fun facts!";
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
       return "The provided API key is not valid. Please check it in the settings.";
    }
    return "Could not fetch a fun fact at the moment. Please try again later.";
  }
}
