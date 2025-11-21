
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
  
  // Advanced Prompt Engineering for Hyper-Realism and Identity Preservation
  let prompt = "CRITICAL PRIORITY: FACIAL IDENTITY PRESERVATION.\n";
  prompt += "The subject in the output image MUST be an EXACT visual match to the person in the reference photos. Do not generate a generic person who looks similar. You must preserve the specific facial features, bone structure, eye shape, nose shape, and skin details of the reference subject exactly.\n";
  prompt += "If the face looks different from the reference, the result is failed. Do not beautify, smooth, or alter the person's identity.\n\n";

  prompt += "ROLE: You are a world-class portrait photographer shooting on high-end 35mm film (e.g., Kodak Portra 400). ";
  
  prompt += "\n\nOBJECTIVE: Create a new photograph of THE EXACT SAME PERSON from the references, but in a new setting/outfit. ";
  prompt += "\nCRITICAL STYLE GUIDELINES (ANTI-AI): ";
  prompt += "\n- Texture: Skin must have visible pores, micro-texture, and natural irregularities. Do NOT airbrush.";
  prompt += "\n- Lighting: Use natural, physically accurate lighting. Allow for organic shadows and film grain.";
  prompt += "\n- Realism: The result must be indistinguishable from a real photograph taken with a camera.";
  
  // Social Media Customization Logic
  if (config.socialPlatform) {
    prompt += `\n\nINTENDED USE: The photo is for a ${config.socialPlatform} profile. `;
    
    const platform = config.socialPlatform.toLowerCase();
    if (platform.includes('linkedin')) {
      prompt += "VIBE: Professional, corporate, confident, trustworthy, and authoritative. Clear, well-lit face. Clean composition. Suitable for a career profile. ";
      if (!config.style) prompt += "OUTFIT DEFAULT: If not specified, assume business professional or smart casual. ";
    } else if (platform.includes('whatsapp')) {
      prompt += "VIBE: Approachable, friendly, stylish but casual. A good-looking profile picture that feels personal and authentic. Clear face visibility. ";
    } else if (platform.includes('instagram')) {
      prompt += "VIBE: Aesthetic, trendy, high-quality lifestyle photography. Vibrant lighting, engaging composition, 'influencer' quality. Visually striking. ";
    } else if (platform.includes('twitter') || platform.includes('x')) {
      prompt += "VIBE: Smart, modern, clean, tech-savvy. Minimalist and sharp. ";
    } else if (platform.includes('dating') || platform.includes('tinder')) {
      prompt += "VIBE: Attractive, warm, confident, and inviting. Flattering lighting (golden hour or soft studio). Best angle. ";
    } else {
      prompt += "VIBE: High quality, engaging, and suitable for this platform. ";
    }
  }

  if (config.region) {
    prompt += `\n\nLOCATION CONTEXT: The photo is taken in ${config.region}. Ensure the background architecture, street signs, foliage, and lighting vibe reflect this specific region authentically. `;
  }

  if (config.customPrompt) {
    prompt += `\n\nUSER INSTRUCTION: ${config.customPrompt} `;
    if (config.style) prompt += `\nOUTFIT REQUIREMENT: Subject is wearing ${config.style}. `;
    if (config.background) prompt += `\nSETTING REQUIREMENT: Location is ${config.background}. `;
  } else {
    prompt += "\n\nTASK SPECIFICS: ";
    
    if (config.style) {
      prompt += `\nOUTFIT: Change clothing to ${config.style}. Ensure fabrics look realistic (heavy cotton, genuine leather sheen, wool texture). `;
    } else {
      prompt += "\nOUTFIT: Keep the outfit suitable for the context/platform, or similar to reference if not specified.";
    }
    
    if (config.background) {
      prompt += `\nBACKGROUND: Location is ${config.background}. `;
      if (config.region) {
        prompt += `Adapt this setting to match the aesthetic of ${config.region}. `;
      }
    }
  }

  prompt += "\n\nEXPRESSION: Maintain the subject's natural expression from the reference images, but adapt slightly to fit the vibe of the selected platform (e.g., confident for LinkedIn, warm for Dating). Do not force a smile if the reference is serious, but ensure it fits the context.";
  
  prompt += "\n\nFINAL VERIFICATION: Check the face in your generated image against the reference. Is it the same person? If not, correct it. The face must be pixel-perfect to the identity.";

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
