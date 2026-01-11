// src/services/geminiService.ts

// 1. TEXT GENERATOR
// (This adds a small delay to make the AI feel like it's "thinking")
export const generateSceneContent = async (corePrompt: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay

  const p = corePrompt.toLowerCase();

  // Return the original text from the story, or a slight variation if you prefer.
  // For this app, returning the prompt itself or a static atmospheric addition works best
  // to keep the story consistent with your written data.
  
  if (p.includes("airport") || p.includes("humidity")) return "The air is thick, smelling of orchids and exhaust fumes. A wall of heat greets you.";
  if (p.includes("marble") || p.includes("sanctuary")) return "The silence here is expensive. The cool air smells of white tea and jasmine.";
  if (p.includes("bass") || p.includes("neon")) return "The beat thumps in your chest. Taxis in pink and yellow blur past like streaks of light.";
  if (p.includes("river") || p.includes("mirror")) return "The water is dark and alive, reflecting the golden temples like a dream.";
  
  // Default fallback if no specific mood matches
  return corePrompt; 
};

// 2. IMAGE GENERATOR
// This is now mapped EXACTLY to your Story Data content
export const generateSceneImage = async (corePrompt: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay for effect

  const p = corePrompt.toLowerCase();
  const t = Date.now(); // Unique timestamp forces image refresh

  // --- SCENE 1: START (Airport) ---
  if (p.includes("humidity hits you") || p.includes("suvarnabhumi")) {
    // Photo of Suvarnabhumi Airport / Arrival
    return `https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1920&fit=crop&t=${t}`;
  }

  // --- SCENE 2A: CHAOS (Night Owl) ---
  if (p.includes("pulses with bass") || p.includes("motorbikes")) {
    // Busy Bangkok street at night, neon lights, tuk tuks
    return `https://images.unsplash.com/photo-1563720223523-491ff04651de?q=80&w=1920&fit=crop&t=${t}`;
  }

  // --- SCENE 3A: STREET FOOD ---
  if (p.includes("grilled pork") || p.includes("lemongrass")) {
    // Street food vendor, steam, intense food vibes
    return `https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1920&fit=crop&t=${t}`;
  }

  // --- SCENE 4A: SWEET CRAVING ---
  if (p.includes("sugar rush") || p.includes("sweetest craving")) {
    // Colorful Thai dessert or neon shop front
    return `https://images.unsplash.com/photo-1544510802-53d9e4e201b1?q=80&w=1920&fit=crop&t=${t}`;
  }

  // --- SCENE 2B: MOVIE PATH (Skyline) ---
  if (p.includes("cinematic glow") || p.includes("softer from a distance")) {
    // Bangkok Skyline at dusk/night
    return `https://images.unsplash.com/photo-1502301197179-65228ab57f78?q=80&w=1920&fit=crop&t=${t}`;
  }

  // --- SCENE 3B: RIVERSIDE ---
  if (p.includes("chao phraya") || p.includes("liquid mirror")) {
    // River view with boats and lights
    return `https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1920&fit=crop&t=${t}`;
  }

  // --- SCENE 4B: TEMPLES ---
  if (p.includes("spires of wat arun") || p.includes("majestic")) {
    // Wat Arun close up detail
    return `https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1920&fit=crop&t=${t}`;
  }

  // --- SCENE 5B: THE RESET ---
  if (p.includes("ground yourself") || p.includes("overloaded")) {
    // Lumpini park or quiet green street
    return `https://images.unsplash.com/photo-1596719600021-f0b3b44b6c3d?q=80&w=1920&fit=crop&t=${t}`;
  }

  // ================= ENDINGS =================

  // ENDING: KHAOSAN
  if (p.includes("wake up with glitter") || p.includes("black out polite")) {
    // Khao San Road party vibes
    return `https://images.unsplash.com/photo-1580977259648-936630f9d9a1?q=80&w=1920&fit=crop&t=${t}`;
  }

  // ENDING: JODD FAIRS
  if (p.includes("jodd fairs") || p.includes("thai spicy")) {
    // Night market food stalls (colorful tents)
    return `https://images.unsplash.com/photo-1533929736472-114620521e6e?q=80&w=1920&fit=crop&t=${t}`;
  }

  // ENDING: 7-ELEVEN
  if (p.includes("ham-and-cheese") || p.includes("toasties")) {
    // 7-Eleven exterior in Thailand (Iconic neon)
    return `https://images.unsplash.com/photo-1633850146039-4d872b225f15?q=80&w=1920&fit=crop&t=${t}`;
  }

  // ENDING: SUKHUMVIT
  if (p.includes("flashy, fruity") || p.includes("own the night")) {
    // Rooftop bar,
