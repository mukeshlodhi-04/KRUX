
import { GoogleGenAI } from "@google/genai";
import type { Message } from '../types';
import { GEMINI_SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
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
