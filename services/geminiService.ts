// 1. TEXT GENERATOR
export const generateSceneContent = async (corePrompt: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const p = corePrompt.toLowerCase();

  if (p.includes("airport") || p.includes("flight") || p.includes("land") || p.includes("start")) return "The cool air of the terminal gives way to a wall of tropical heat. The humidity wraps around you like a heavy blanket.";
  if (p.includes("hotel") || p.includes("lobby") || p.includes("room")) return "The lobby is a sanctuary of cool marble and scented air. Outside, the city roars, but here is peace.";
  if (p.includes("temple") || p.includes("wat") || p.includes("monk")) return "Golden spires pierce the blue sky. The scent of incense is thick, grounding the spiritual silence.";
  if (p.includes("market") || p.includes("food") || p.includes("eat") || p.includes("street")) return "Steam rises from sizzling woks. The neon signs reflect off wet pavement, illuminating the hungry crowd.";
  if (p.includes("river") || p.includes("boat") || p.includes("water")) return "The river churns dark and powerful. Long-tail boats spray mist into the air as they cut through the waves.";
  if (p.includes("sky") || p.includes("view") || p.includes("roof") || p.includes("bar")) return "From up here, the city looks like a circuit board of golden light. The wind is stronger, whipping your hair.";

  // Fallback text
  return "The city hums with an electric energy. Neon lights flicker against the night sky, painting the humid darkness in shades of magenta and cyan.";
};

// 2. IMAGE GENERATOR
export const generateSceneImage = async (corePrompt: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const p = corePrompt.toLowerCase();
  // Using Date.now() guarantees a unique URL every time, so the browser actually reloads the image.
  const t = Date.now(); 

  // 1. ARRIVAL
  if (p.includes("airport") || p.includes("land") || p.includes("start") || p.includes("arrival")) {
    return `https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1920&fit=crop&t=${t}`;
  }

  // 2. HOTEL
  if (p.includes("hotel") || p.includes("lobby") || p.includes("check")) {
    return `https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&fit=crop&t=${t}`;
  }

  // 3. TEMPLES
  if (p.includes("temple") || p.includes("wat") || p.includes("culture")) {
    return `https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1920&fit=crop&t=${t}`; 
  }
  
  // 4. FOOD
  if (p.includes("market") || p.includes("food") || p.includes("street") || p.includes("eat")) {
    return `https://images.unsplash.com/photo-1533929736472-114620521e6e?q=80&w=1920&fit=crop&t=${t}`; 
  }
  
  // 5. RIVER
  if (p.includes("river") || p.includes("boat") || p.includes("water")) {
    return `https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1920&fit=crop&t=${t}`; 
  }

  // 6. SHOPPING
  if (p.includes("mall") || p.includes("shop") || p.includes("buy")) {
    return `https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1920&fit=crop&t=${t}`;
  }

  // 7. ROOFTOP
  if (p.includes("sky") || p.includes("drink") || p.includes("bar") || p.includes("party")) {
    return `https://images.unsplash.com/photo-1585293678077-e892c90606d1?q=80&w=1920&fit=crop&t=${t}`;
  }

  // Default Fallback
  return `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&fit=crop&t=${t}`;
};
