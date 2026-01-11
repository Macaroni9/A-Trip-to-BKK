// No API keys or imports needed anymore!

// 1. Text Generator (The "Writer")
export const generateSceneContent = async (corePrompt: string): Promise<string> => {
  // We simulate a tiny delay to make it feel smooth
  await new Promise(resolve => setTimeout(resolve, 300));

  const promptLower = corePrompt.toLowerCase();

  if (promptLower.includes("temple") || promptLower.includes("wat")) {
    return "The golden spires catch the last rays of the sun. Incense smoke curls through the heavy air, mixing with the scent of jasmine garlands, while monks chant in a rhythm that seems to slow down time itself.";
  }

  if (promptLower.includes("market") || promptLower.includes("food") || promptLower.includes("street")) {
    return "Steam rises from sizzling woks, carrying the spicy aroma of chilies and holy basil. The neon signs reflect off the wet pavement, creating a kaleidoscope of colors as the crowd moves like a living river.";
  }

  if (promptLower.includes("river") || promptLower.includes("boat")) {
    return "The Chao Phraya river churns dark and cool beneath the hull. Long-tail boats roar past, spraying mist into the humid night, while the illuminated city skyline stands as a silent watcher in the distance.";
  }

  if (promptLower.includes("tuk") || promptLower.includes("traffic")) {
    return "The engine roars to life, vibrating through the metal frame. Wind rushes past your face, carrying the city's grit and energy, as you weave through the gridlock in a blur of motion and flashing lights.";
  }

  // Fallback text if the prompt is something else
  return "The city hums with an electric energy that you can feel in your bones. Neon lights flicker against the night sky, painting the humid darkness in shades of magenta and cyan.";
};

// 2. Image Generator (The "Photographer")
export const generateSceneImage = async (corePrompt: string): Promise<string | null> => {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const promptLower = corePrompt.toLowerCase();

  if (promptLower.includes("temple") || promptLower.includes("wat")) {
    // Wat Arun / Temple
    return "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1920&auto=format&fit=crop"; 
  }
  
  if (promptLower.includes("market") || promptLower.includes("food") || promptLower.includes("street")) {
    // Chinatown / Street Food
    return "https://images.unsplash.com/photo-1533929736472-114620521e6e?q=80&w=1920&auto=format&fit=crop"; 
  }
  
  if (promptLower.includes("river") || promptLower.includes("boat")) {
    // Chao Phraya River
    return "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1920&auto=format&fit=crop"; 
  }

  if (promptLower.includes("tuk") || promptLower.includes("traffic")) {
    // Tuk Tuk
    return "https://images.unsplash.com/photo-1582468575692-aec101908972?q=80&w=1920&auto=format&fit=crop"; 
  }

  // Default: General Bangkok Night
  return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop";
};
