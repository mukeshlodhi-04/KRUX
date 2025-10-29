
import { GoogleGenAI } from "@google/genai";
import type { Message } from '../types';
import { GEMINI_SYSTEM_INSTRUCTION } from '../constants';

// Read API key from Vite environment variable. Vite exposes env vars prefixed with VITE_ to the client.
// For local development, set VITE_GOOGLE_API_KEY in a `.env.local` file or export it before running `npm run dev`.
// Use an any-cast to avoid TypeScript ImportMeta typing issues in some setups.
const API_KEY = (import.meta as any).env?.VITE_GOOGLE_API_KEY as string | undefined;

if (!API_KEY) {
    console.warn("VITE_GOOGLE_API_KEY not set. Gemini API calls will fail. Set VITE_GOOGLE_API_KEY in .env.local or your environment for local dev.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getBotResponse = async (history: Message[]): Promise<string> => {
    if (!API_KEY) {
        return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
    }
    
    const contents = history.map(msg => ({
        role: msg.sender.role === 'customer' ? 'user' : 'model',
        parts: [{ text: msg.text }],
    }));

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching Gemini response:", error);
        return "I'm sorry, I encountered an error. Could you please try again?";
    }
};
