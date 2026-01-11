// src/services/geminiService.ts

// 1. TEXT GENERATOR 
export const generateSceneContent = async (corePrompt: string): Promise<string> => {
  // A small natural delay for reading pace
  await new Promise(resolve => setTimeout(resolve, 1000));
  return corePrompt; 
};

// 2. IMAGE GENERATOR
// We accept 'sceneId' (e.g. 'start', '2A') to return the exact correct image every time.
export const generateSceneImage = async (sceneId: string): Promise<string> => {
  // 1.5 second delay for cinematic effect
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Note: We removed the timestamp (?t=...) so the browser caches the images for speed.

  switch (sceneId) {
    // --- INTRO ---
    case 'start': 
      return "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1920&fit=crop";

    // --- PATH A (CHAOS) ---
    case '2A': 
      return "https://images.unsplash.com/photo-1563720223523-491ff04651de?q=80&w=1920&fit=crop";
    case '3A': 
      return "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1920&fit=crop";
    case '4A': 
      return "https://images.unsplash.com/photo-1544510802-53d9e4e201b1?q=80&w=1920&fit=crop";

    // --- PATH B (MOVIE) ---
    case '2B': 
      return "https://images.unsplash.com/photo-1502301197179-65228ab57f78?q=80&w=1920&fit=crop";
    case '3B': 
      return "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1920&fit=crop";
    case '4B': 
      return "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1920&fit=crop";
    case '5B': 
      return "https://images.unsplash.com/photo-1596719600021-f0b3b44b6c3d?q=80&w=1920&fit=crop";

    // --- ENDINGS ---
    case 'khaosan_ending': 
      return "https://images.unsplash.com/photo-1580977259648-936630f9d9a1?q=80&w=1920&fit=crop";
    case 'jodd_fairs_ending': 
      return "https://images.unsplash.com/photo-1533929736472-114620521e6e?q=80&w=1920&fit=crop";
    case '711_sweets_ending': 
      return "https://images.unsplash.com/photo-1633850146039-4d872b225f15?q=80&w=1920&fit=crop";
    case 'sukhumvit_ending': 
      return "https://images.unsplash.com/photo-1570530752763-71a62d3a3d5e?q=80&w=1920&fit=crop";
    case 'chao_phraya_ending': 
      return "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1920&fit=crop";
    case 'hotel_lobby_ending': 
      return "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&fit=crop";
    case 'bts_skyline_ending': 
      return "https://images.unsplash.com/photo-1481819613568-3701cbc70156?q=80&w=1920&fit=crop";
    case 'chatuchak_ending': 
      return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&fit=crop";
    case 'massage_ending': 
      return "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1920&fit=crop";

    default:
      // Fallback: General Bangkok Night
      return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&fit=crop";
  }
};
