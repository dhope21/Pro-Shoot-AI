
export enum OutfitStyle {
  CASUAL = 'Casual',
  FORMAL = 'Formal Suit',
  HOODIE = 'Zipper Hoodie',
  LEATHER_JACKET = 'Leather Jacket',
  CYBERPUNK = 'Cyberpunk Techwear'
}

export enum BackgroundType {
  STUDIO = 'Pro Studio',
  OFFICE = 'Modern Office',
  HOME = 'Cozy Home',
  BALCONY = 'Luxury Balcony',
  OUTDOOR = 'Urban Bokeh',
  NEON = 'Neon City'
}

export interface GenerationConfig {
  style: string | null;
  background: string | null;
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
