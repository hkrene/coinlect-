import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (userMessage: string, userLanguage?: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Debug logging
  console.log('getGeminiResponse called');
  console.log('API Key exists:', !!apiKey);
  console.log('API Key first 10 chars:', apiKey?.substring(0, 10) || 'N/A');
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    return "I'm sorry, I cannot connect to the AI service right now (Missing API Key).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash"; 
    
    // Determine the response language based on user input and interface language
    const isFrenchUser = userLanguage === 'fr' ||
                        /bonjour|salut|merci|comment|pourquoi|quand|où|qui|quoi|comment/i.test(userMessage) ||
                        userMessage.includes('?') && !userMessage.includes('? ') && /est|est-ce|sont|avez|êtes|sommes/i.test(userMessage);

    const responseLanguage = isFrenchUser ? 'French' : 'English';

    console.log('Detected user language:', responseLanguage, 'based on userLanguage:', userLanguage, 'and message:', userMessage.substring(0, 50));

    const config = {
      systemInstruction: "You are CoinlectAI, a helpful assistant for the Coinlect cryptocurrency education platform. You answer questions about crypto trading, blockchain concepts, and how to use the Coinlect platform for education purporse only. Keep answers concise, friendly, and professional. Use French or English depending on the user's input.",
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: config
    });

    return response.text || "Sorry, I didn't catch that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble processing your request right now. Please try again later.";
  }
};