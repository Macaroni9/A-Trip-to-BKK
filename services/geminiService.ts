import { Scene } from '../types';

// 1. TEXT GENERATOR
export const generateSceneContent = async (corePrompt: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return corePrompt; 
};

// 2. IMAGE GENERATOR
export const generateSceneImage = async (sceneId: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Base parameters for optimization
  const params = "?q=80&w=1920&fit=crop";

  switch (sceneId) {
    // --- INTRO ---
    case 'start': // Suvarnabhumi Airport / Arrival
      return `https://images.unsplash.com/photo-1569154941061-e231b4725ef1${params}`;

    // --- PATH A (CHAOS) ---
    case '2A': // Night Traffic / Neon
      return `https://images.unsplash.com/photo-1563720223523-491ff04651de${params}`;
    
    case '3A': // Street Food / Grill
      // Thai Street Food vendor
      return `https://images.unsplash.com/photo-1559314809081-2748f21945d3${params}`;

    case '4A': // Sweets / Dessert
      // Colorful dessert/sweets
      return `https://images.unsplash.com/photo-1504544750208-dc0358e63f7f${params}`;

    // --- PATH B (MOVIE) ---
    case '2B': // Skyline / Cinematic
      // Bangkok Cityscape
      return `https://images.unsplash.com/photo-1502301197179-65228ab57f78${params}`;

    case '3B': // River / Wat Arun View
      return `https://images.unsplash.com/photo-1552465011-b4e21bf6e79a${params}`;

    case '4B': // Temple Detail
      return `https://images.unsplash.com/photo-1548013146-72479768bada${params}`;

    case '5B': // Park / Greenery
      // Lumpini Park vibes
      return `https://images.unsplash.com/photo-1596719600021-f0b3b44b6c3d${params}`;

    // --- ENDINGS ---
    case 'khaosan_ending': // Party / Nightlife
      return `https://images.unsplash.com/photo-1580977259648-936630f9d9a1${params}`;

    case 'jodd_fairs_ending': // Night Market Tents
      return `https://images.unsplash.com/photo-1533929736472-114620521e6e${params}`;

    case '711_sweets_ending': // Convenience Store Neon
      // Fallback to a neon city vibe if specific 7-11 is restricted
      return `https://images.unsplash.com/photo-1554763071-6c2e2c269222${params}`;

    case 'sukhumvit_ending': // Rooftop Bar
      return `https://images.unsplash.com/photo-1570530752763-71a62d3a3d5e${params}`;

    case 'chao_phraya_ending': // Sunset River
      return `https://images.unsplash.com/photo-1508009603885-50cf7c579365${params}`;

    case 'hotel_lobby_ending': // Luxury Interior
      return `https://images.unsplash.com/photo-1566073771259-6a8506099945${params}`;

    case 'bts_skyline_ending': // Modern Transport/City
      return `https://images.unsplash.com/photo-1481819613568-3701cbc70156${params}`;

    case 'chatuchak_ending': // Clothes Market
      return `https://images.unsplash.com/photo-1441986300917-64674bd600d8${params}`;

    case 'massage_ending': // Spa Atmosphere
      return `https://images.unsplash.com/photo-1544161515-4ab6ce6db874${params}`;

    default:
      // Reliable Fallback (Tuk Tuk)
      return `https://images.unsplash.com/photo-1552458421-23a35f79a25b${params}`;
  }
};
