
import { Scene } from '../types';

// 1. TEXT GENERATOR (Simulated for now, passes through the core prompt)
export const generateSceneContent = async (corePrompt: string): Promise<string> => {
  // Simulate network delay for effect
  await new Promise(resolve => setTimeout(resolve, 800));
  return corePrompt; 
};

// 2. IMAGE GENERATOR (Mapped to your specific IBB/Imgur links)
export const generateSceneImage = async (sceneId: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  switch (sceneId) {
    // --- INTRO ---
    case 'start': 
      // Landing / Airport
      return 'https://i.ibb.co/VYvVcV94/original.png';

    // --- PATH A (CHAOS / NIGHT) ---
    case '2A': 
      // Neon streets / Tuk-tuks
      return 'https://i.ibb.co/CsH5p8VC/original-1.png';
    
    case '3A': 
      // Street Food / Smoke
      return 'https://i.ibb.co/YT8MkFsd/original-2.png';

    case '4A': 
      // Desserts / 7-Eleven
      return 'https://i.ibb.co/G4b1g8Lx/original-3.png';

    // --- PATH B (MOVIE / CALM) ---
    case '2B': 
      // Movie vibe / Scenic
      return 'https://i.ibb.co/Y4pY4CfS/original-4.png';

    case '3B': 
      // Riverside / Water
      return 'https://i.ibb.co/8DqbvrsW/original-5.png';

    case '4B': 
      // Temples / Old Town
      return 'https://i.ibb.co/WdzZctd/original-6.png';

    case '5B': 
      // Park / Greenery Reset
      return 'https://i.ibb.co/cKxk0Wmg/original-7.png';

    // --- ENDINGS (DRINKS) ---
    case 'khaosan_ending': 
      // Drink #1: Khaosan Road (Straight Up)
      return 'https://i.ibb.co/nqY7F9rL/original-8.png';

    case 'chao_phraya_ending': 
      // Drink #2: Chao Phraya (Spritz)
      return 'https://i.ibb.co/pvwvPR8F/original-9.png';

    case 'jodd_fairs_ending': 
      // Drink #3: Jodd Fairs (Umami/Spicy)
      return 'https://i.ibb.co/jvB5PV3R/original-10.png';

    case '711_sweets_ending': 
      // Drink #4: 7-Eleven (Sweet/Dessert)
      return 'https://i.ibb.co/rfpGbGgq/original-11.png';

    case 'sukhumvit_ending': 
      // Drink #5: Sukhumvit (Pornstar Martini)
      return 'https://i.ibb.co/xSmnwMZT/original-12.png';

    case 'hotel_lobby_ending': 
      // Drink #6: Hotel Lobby (Old Fashioned)
      return 'https://i.ibb.co/4ZvQs5sC/original-13.png';

    case 'bts_skyline_ending': 
      // Drink #7: BTS Skyline (Highball)
      return 'https://i.ibb.co/vxpQ3yd7/original-14.png';

    case 'chatuchak_ending': 
      // Drink #8: Chatuchak (Mocktail 1)
      return 'https://i.ibb.co/wr6pjKJX/original-15.png';

    case 'massage_ending': 
      // Drink #9: Massage (Mocktail 2)
      return 'https://i.ibb.co/RTbJ7Y0z/original-16.png';

    default:
      // Fallback (Use the Start image just in case)
      return 'https://i.ibb.co/VYvVcV94/original.png';
  }
};
