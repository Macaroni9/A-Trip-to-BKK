// 1. Text Generator (The "Writer")
export const generateSceneContent = async (corePrompt: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const p = corePrompt.toLowerCase();

  if (p.includes("airport") || p.includes("flight") || p.includes("land") || p.includes("touchdown")) {
    return "The cool air of the terminal gives way to a wall of tropical heat. The humidity wraps around you like a heavy blanket, smelling of ozone and distant rain.";
  }
  if (p.includes("hotel") || p.includes("lobby") || p.includes("check")) {
    return "The lobby is a sanctuary of cool marble and scented air. Outside the glass walls, the city roars, but in here, it is just the soft chime of the elevator and a welcoming smile.";
  }
  if (p.includes("temple") || p.includes("wat") || p.includes("monk")) {
    return "Golden spires pierce the blue sky, catching the sunlight in a dazzling display. The scent of incense is thick, grounding the spiritual silence amidst the city's chaos.";
  }
  if (p.includes("market") || p.includes("food") || p.includes("street") || p.includes("eat")) {
    return "The air sizzles with the sound of woks and the spicy aroma of chilies. Neon signs reflect off wet pavement, illuminating the faces of hungry travelers and busy vendors.";
  }
  if (p.includes("river") || p.includes("boat") || p.includes("water")) {
    return "The river churns dark and powerful. Long-tail boats spray mist into the air as they cut through the waves, passing ancient temples and modern skyscrapers side by side.";
  }
  if (p.includes("tuk") || p.includes("traffic") || p.includes("ride")) {
    return "The engine roars beneath you, vibrating through the seat. The wind rushes past, carrying the grit of the city, as you weave through traffic in a blur of color and noise.";
  }
  if (p.includes("sky") || p.includes("view") || p.includes("roof") || p.includes("bar")) {
    return "From up here, the city looks like a circuit board of golden light. The wind is stronger, whipping your hair as you toast to the endless horizon of Bangkok.";
  }
  if (p.includes("mall") || p.includes("shop") || p.includes("buy")) {
    return "Polished floors and endless rows of luxury goods surround you. The air conditioning is crisp, a stark contrast to the humid world waiting just outside the automatic doors.";
  }

  // Fallback
  return "The city hums with an electric energy. Neon lights flicker against the night sky, painting the humid darkness in shades of magenta and cyan.";
};

// 2. Image Generator (The "Photographer")
export const generateSceneImage = async (corePrompt: string): Promise<string | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const p = corePrompt.toLowerCase();
  
  // We add a timestamp query (&t=...) to force React to reload the image every time
  const time = Date.now();

  // 1. AIRPORT / ARRIVAL
  if (p.includes("airport") || p.includes("suvarnabhumi") || p.includes("land") || p.includes("plane") || p.includes("touchdown")) {
    return `https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1920&fit=crop&t=${time}`;
  }

  // 2. HOTEL / ROOM
  if (p.includes("hotel") || p.includes("room") || p.includes("lobby") || p.includes("stay")) {
    return `https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&fit=crop&t=${time}`;
  }

  // 3. TEMPLES
  if (p.includes("temple") || p.includes("wat") || p.includes("buddha")) {
    return `https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1920&fit=crop&t=${time}`; 
  }
  
  // 4. STREET FOOD / MARKETS
  if (p.includes("market") || p.includes("food") || p.includes("street") || p.includes("night")) {
    return `https://images.unsplash.com/photo-1533929736472-114620521e6e?q=80&w=1920&fit=crop&t=${time}`; 
  }
  
  // 5. RIVER / BOAT
  if (p.includes("river") || p.includes("boat") || p.includes("ferry")) {
    return `https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1920&fit=crop&t=${time}`; 
  }

  // 6. TUK TUK / TRAFFIC
  if (p.includes("tuk") || p.includes("traffic") || p.includes("taxi") || p.includes("car")) {
    return `https://images.unsplash.com/photo-1582468575692-aec101908972?q=80&w=1920&fit=crop&t=${time}`; 
  }

  // 7. MALL / SHOPPING
  if (p.includes("mall") || p.includes("shop") || p.includes("paragon") || p.includes("central")) {
    return `https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1920&fit=crop&t=${time}`;
  }

  // 8. SKY BAR / VIEW / DRINK
  if (p.includes("sky") || p.includes("view") || p.includes("drink") || p.includes("alcohol") || p.includes("bar")) {
    return `https://images.unsplash.com/photo-1585293678077-e892c90606d1?q=80&w=1920&fit=crop&t=${time}`;
  }

  // Default: General Bangkok Night (Catch-all)
  // We use a general cityscape if nothing matches
  return `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&fit=crop&t=${time}`;
};
