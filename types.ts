export enum OutfitStyle {
  CASUAL = 'Casual Everyday',
  FORMAL = 'Formal Business Suit',
  HOODIE = 'Streetwear Hoodie',
  LEATHER_JACKET = 'Leather Jacket',
  TURTLENECK = 'Black Turtleneck',
  CYBERPUNK = 'Cyberpunk Techwear',
  VINTAGE = 'Vintage 90s Aesthetic'
}

export enum BackgroundType {
  STUDIO = 'Professional Studio',
  OFFICE = 'Modern Office Space',
  HOME = 'Cozy Modern Home',
  BALCONY = 'Luxury City Balcony',
  OUTDOOR = 'Urban Street Bokeh',
  NEON = 'Neon City Night',
  BEACH = 'Golden Hour Beach'
}

export enum Expression {
  SMILING = 'Warm Smile',
  LAUGHING = 'Laughing Candidly',
  SERIOUS = 'Serious Professional',
  SEDUCTIVE = 'Seductive / Alluring',
  ANGRY = 'Fierce / Intense',
  SAD = 'Melancholic / Moody',
  NEUTRAL = 'Calm Neutral'
}

export interface GenerationConfig {
  style: OutfitStyle | null;
  background: BackgroundType | null;
  expression: Expression | null;
  customPrompt: string;
  region: string;
}

export interface ImageInput {
  id: string;
  file: File;
  previewUrl: string;
  base64: string; // Raw base64 without prefix
  mimeType: string;
}