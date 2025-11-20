import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationConfig, ImageInput } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateEditedImage = async (
  images: ImageInput[],
  config: GenerationConfig
): Promise<string> => {
  const ai = getClient();
  
  // Advanced Prompt Engineering for Hyper-Realism
  let prompt = "ROLE: You are a world-class photographer shooting on high-end 35mm film (e.g., Kodak Portra 400) or a Phase One digital back. ";
  
  prompt += "\n\nOBJECTIVE: Generate a photorealistic image using the provided reference(s). The result MUST be indistinguishable from a real photograph. ";
  prompt += "\nCRITICAL STYLE GUIDELINES (ANTI-AI): ";
  prompt += "\n- Texture: Skin must have visible pores, micro-texture, and natural irregularities. Do NOT airbrush or smooth skin. ";
  prompt += "\n- Lighting: Use natural, physically accurate lighting. Allow for slight imperfections like lens flares, organic shadows, or film grain to sell the realism. ";
  prompt += "\n- Environment: Backgrounds must look 'lived-in' and detailed, not sterile or empty.";
  
  if (config.region) {
    prompt += `\n\nLOCATION CONTEXT: The photo is taken in ${config.region}. Ensure the background architecture, street signs, foliage, and lighting vibe reflect this specific region authentically. `;
  }

  if (config.customPrompt) {
    prompt += `\n\nUSER INSTRUCTION: ${config.customPrompt} `;
    if (config.style) prompt += `\nStyle Guidance: Subject is wearing ${config.style}. `;
    if (config.expression) prompt += `\nExpression Guidance: Subject has a ${config.expression} expression. `;
    if (config.background) prompt += `\nSetting Guidance: Location is ${config.background}. `;
  } else {
    prompt += "\n\nTASK: Produce a high-quality professional shot. ";
    
    if (config.style) {
      prompt += `\nOUTFIT: Change clothing to ${config.style}. Ensure fabrics look realistic (heavy cotton, genuine leather sheen, wool texture). `;
    }

    if (config.expression) {
      prompt += `\nFACIAL EXPRESSION: Change the subject's expression to ${config.expression}. Ensure natural muscle changes in the face (eyes, mouth corners) to match this emotion authentically while strictly preserving facial identity. `;
    }
    
    if (config.background) {
      prompt += `\nBACKGROUND: Location is ${config.background}. `;
      if (config.region) {
        prompt += `Adapt this setting to match the aesthetic of ${config.region}. `;
      }
    }
    
    prompt += "\nIDENTITY: Preserve the facial identity structure exactly.";
  }

  prompt += "\n\nFINAL OUTPUT: A raw, uncompressed looking photograph. Avoid the 'plastic' look of standard AI generation.";

  try {
    const parts: any[] = [];
    
    // Add all images as input parts
    images.forEach(img => {
      parts.push({
        inlineData: {
          data: img.base64,
          mimeType: img.mimeType,
        },
      });
    });

    // Add the text prompt
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract image from response
    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      const base64ImageBytes = part.inlineData.data;
      const responseMime = part.inlineData.mimeType || 'image/png';
      return `data:${responseMime};base64,${base64ImageBytes}`;
    }

    throw new Error("No image data found in response. The model may have refused the request or generated text instead.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};