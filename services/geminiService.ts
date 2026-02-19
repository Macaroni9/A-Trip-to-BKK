
import { Scene } from '../types';

// 1. TEXT GENERATOR (Simulated for now, passes through the core prompt)
export const generateSceneContent = async (corePrompt: string): Promise<string> => {
  // Simulate network delay for effect
  await new Promise(resolve => setTimeout(resolve, 800));
  return corePrompt; 
};

// Placeholder for the secondary image link to be updated later
const DEFAULT_SECONDARY_ENDING_IMAGE = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1920&auto=format&fit=crop";

// 2. IMAGE GENERATOR (Now supports returning multiple images for endings)
export const generateSceneImage = async (sceneId: string): Promise<string | string[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let primaryImage = '';

  switch (sceneId) {
    // --- INTRO ---
    case 'start': 
      primaryImage = 'https://i.ibb.co/VYvVcV94/original.png';
      break;

    // --- PATH A (CHAOS / NIGHT) ---
    case '2A': 
      primaryImage = 'https://i.ibb.co/CsH5p8VC/original-1.png';
      break;
    
    case '3A': 
      primaryImage = 'https://i.ibb.co/YT8MkFsd/original-2.png';
      break;

    case '4A': 
      primaryImage = 'https://i.ibb.co/G4b1g8Lx/original-3.png';
      break;

    // --- PATH B (MOVIE / CALM) ---
    case '2B': 
      primaryImage = 'https://i.ibb.co/Y4pY4CfS/original-4.png';
      break;

    case '3B': 
      primaryImage = 'https://i.ibb.co/8DqbvrsW/original-5.png';
      break;

    case '4B': 
      primaryImage = 'https://i.ibb.co/WdzZctd/original-6.png';
      break;

    case '5B': 
      primaryImage = 'https://i.ibb.co/cKxk0Wmg/original-7.png';
      break;

    // --- ENDINGS (DRINKS) ---
    case 'khaosan_ending': 
      primaryImage = 'https://i.ibb.co/nqY7F9rL/original-8.png';
      break;

    case 'chao_phraya_ending': 
      primaryImage = 'https://i.ibb.co/pvwvPR8F/original-9.png';
      break;

    case 'jodd_fairs_ending': 
      primaryImage = 'https://i.ibb.co/jvB5PV3R/original-10.png';
      break;

    case '711_sweets_ending': 
      primaryImage = 'https://i.ibb.co/rfpGbGgq/original-11.png';
      break;

    case 'sukhumvit_ending': 
      primaryImage = 'https://i.ibb.co/xSmnwMZT/original-12.png';
      break;

    case 'hotel_lobby_ending': 
      primaryImage = 'https://i.ibb.co/4ZvQs5sC/original-13.png';
      break;

    case 'bts_skyline_ending': 
      primaryImage = 'https://i.ibb.co/vxpQ3yd7/original-14.png';
      break;

    case 'chatuchak_ending': 
      primaryImage = 'https://i.ibb.co/wr6pjKJX/original-15.png';
      break;

    case 'massage_ending': 
      primaryImage = 'https://i.ibb.co/4ZTx2qGW/c76fabe2-7f10-44ec-a2b9-c9c5ccbea8a9-7db7d965-7532-4036-8293-07ad270c8d0d-raw.png';
      break;

    default:
      primaryImage = 'https://i.ibb.co/VYvVcV94/original.png';
      break;
  }

  // If it's an ending, return both the primary and the specific secondary drink image
  if (sceneId.endsWith('_ending')) {
    let secondaryImage = DEFAULT_SECONDARY_ENDING_IMAGE;

    if (sceneId === 'khaosan_ending') {
      secondaryImage = 'https://i.ibb.co/h1njp48Z/ccf9edb5-38d5-4bd2-92ed-3b411b920313-4b85d0dd-9179-4307-8b3f-bebff43cfde7-raw.jpg';
    } else if (sceneId === 'chao_phraya_ending') {
      secondaryImage = 'https://i.ibb.co/hx9D5bZM/chao-phraya.png';
    } else if (sceneId === 'jodd_fairs_ending') {
      secondaryImage = 'https://i.ibb.co/C3C88TZJ/095880d2-41a5-439e-8a75-aa1333f73d0f-e74c4682-09ec-4541-a9a1-361630f1a930-raw.jpg';
    } else if (sceneId === '711_sweets_ending') {
      secondaryImage = 'https://i.ibb.co/0pfhbPws/c7192fee-cfa1-460a-9b83-99a4afd7f180-3ad42d54-4d5d-411e-976f-0f1d189cdfec-raw.jpg';
    }

    return [primaryImage, secondaryImage];
  }

  return primaryImage;
};
