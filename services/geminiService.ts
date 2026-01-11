
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSceneContent = async (corePrompt: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a sensory-focused travel writer and mixologist in Bangkok. Based on this scene core: "${corePrompt}", write a vibrant, immersive 3-sentence description. Focus on the humidity, the electric neon colors, the smells of spices or perfume, and the specific vibe of the location. Be stylish and evocative.`,
    });
    return response.text || "The scent of jasmine and exhaust fumes mingles in the humid air...";
  } catch (error) {
    console.error("Narrative generation failed", error);
    return corePrompt;
  }
};

export const generateSceneImage = async (corePrompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Cinematic travel photography of Bangkok at night, luxury travel vibe, vibrant neon lights (magenta and cyan), bokeh background, high contrast, 8k, wide shot, atmospheric: ${corePrompt}` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed", error);
    return null;
  }
};
