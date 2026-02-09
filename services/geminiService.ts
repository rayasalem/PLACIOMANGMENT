
import { GoogleGenAI, Type } from "@google/genai";

// The GoogleGenAI instance is created within functions to ensure it captures the latest environment state
// following the strict requirement to use process.env.API_KEY directly.

const getAIClient = () => {
  const apiKey = (globalThis as any).process?.env?.API_KEY || (process.env as any).API_KEY;
  return new GoogleGenAI({ apiKey });
};

export const generateMarketingSlogan = async (productName: string, description: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a high-converting, catchy marketing slogan and a short social media post for this product: 
      Name: ${productName}
      Description: ${description}`,
      config: {
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slogan: { type: Type.STRING },
            socialPost: { type: Type.STRING },
          },
          required: ["slogan", "socialPost"]
        }
      }
    });
    
    const text = response.text || '{"slogan": "", "socialPost": ""}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { 
      slogan: "Unleash the potential of your product.", 
      socialPost: "Check out our latest offering! Quality you can trust." 
    };
  }
};

export const generateProductDescription = async (productName: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a professional and persuasive e-commerce product description for: ${productName}. Keep it under 100 words.`,
    });
    return response.text || "Amazing product that solves all your needs with premium quality.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Amazing product that solves all your needs with premium quality.";
  }
};
