
import { Scene } from '../types';

export const STORY_DATA: Record<string, Scene> = {
  'start': {
    id: 'start',
    title: 'Touchdown in Suvarnabhumi',
    corePrompt: 'The humidity hits you like a warm hug as you step out of the airport. The smell of jet fuel and orchids fills the air. Bangkok is waiting.',
    choices: [
      { id: 'c1', text: 'Drop my bags and chase chaos.', nextSceneId: '2A' },
      { id: 'c2', text: 'Sabai Sabai; I want Bangkok to feel like a movie.', nextSceneId: '2B' }
    ]
  },
  // CHAOS PATH
  '2A': {
    id: '2A',
    title: 'A Night Owl’s Test',
    corePrompt: 'The city pulses with bass and neon. Motorbikes weave through traffic like schools of fish. Where do you dive in?',
    choices: [
      { id: 'c3', text: 'Neon Streets, Buckets, and Bad Decisions.', nextSceneId: 'khaosan_ending' },
      { id: 'c4', text: 'I want the city to hit me with a Flavor Bomb.', nextSceneId: '3A' }
    ]
  },
  '3A': {
    id: '3A',
    title: 'First Proper Bite',
    corePrompt: 'The air is thick with the scent of grilled pork, noodle shops. Street vendors are busy, you can hear the 7 11 door chime every now and then.',
    choices: [
      { id: 'c5', text: 'Street food carnival—smoke, Spice, Crowd.', nextSceneId: 'jodd_fairs_ending' },
      { id: 'c6', text: 'Craving for Dessert or fruits.', nextSceneId: '4A' }
    ]
  },
  '4A': {
    id: '4A',
    title: 'The Sweetest Craving',
    corePrompt: 'The heat is real. You need a sugar rush to keep the momentum going. What’s the move?',
    choices: [
      { id: 'c7', text: '7-Eleven sweets, guilty joy.', nextSceneId: '711_sweets_ending' },
      { id: 'c8', text: 'I want a ‘fancy messy’ bougie moment.', nextSceneId: 'sukhumvit_ending' }
    ]
  },
  // MOVIE PATH
  '2B': {
    id: '2B',
    title: 'The Bangkok Postcard',
    corePrompt: 'You’re looking for that cinematic glow. The city looks softer from a distance, like a dream in gold and blue.',
    choices: [
      { id: 'c9', text: 'River & Skyline, like I’m in a Music Video.', nextSceneId: '3B' },
      { id: 'c10', text: 'Temples, Old streets, and Travel.', nextSceneId: '4B' }
    ]
  },
  '3B': {
    id: '3B',
    title: 'Riverside Magic',
    corePrompt: 'The Chao Phraya river reflects the city lights like a liquid mirror. The breeze is finally cool.',
    choices: [
      { id: 'c11', text: 'Golden Hour, Breezy, Light, Sparkly.', nextSceneId: 'chao_phraya_ending' },
      { id: 'c12', text: 'Quiet, Classy, Slow-Sip Energy.', nextSceneId: 'hotel_lobby_ending' }
    ]
  },
  '4B': {
    id: '4B',
    title: 'Out on Foot',
    corePrompt: 'The city unfolds one street at a time. You can rise above it all for something quick and crisp, or wander toward temples and weekend markets — every step a different rhythm. How are we moving?',
    choices: [
      { id: 'c13', text: 'Quick Ride—Keep it Crisp.', nextSceneId: 'bts_skyline_ending' },
      { id: 'c14', text: 'Too Hot. I need a non-alcohol reset first.', nextSceneId: '5B' }
    ]
  },
  '5B': {
    id: '5B',
    title: 'The Great Reset',
    corePrompt: 'Your senses are overloaded. You need to ground yourself before the next adventure.',
    choices: [
      { id: 'c15', text: 'Iconic tourist-proof: Market & Hustle.', nextSceneId: 'chatuchak_ending' },
      { id: 'c16', text: 'I want to be where the bells echo, seeking stillness.', nextSceneId: 'massage_ending' }
    ]
  },
  // ENDINGS
  'khaosan_ending': {
    id: 'khaosan_ending',
    title: 'KHAOSAN REGRET',
    corePrompt: 'The music is deafening, the buckets are strong. You black out politely and wake up with glitter in your pocket and a smile on your face.',
    recipe: 'Pisco, Gin, Coconut fat-washed Aperol, Strawberry, Verjus, Sour Rainbow.',
    abv: 3,
    sweetness: 2,
    choices: [],
    isEnding: true
  },
  'jodd_fairs_ending': {
    id: 'jodd_fairs_ending',
    title: 'JODD FAIRS GLUTTONY',
    corePrompt: 'Surrounded by the glow of the night market. You sweat, you smile, and you pretend you can handle Thai spicy. Your soul feels seasoned.',
    recipe: 'Reposado Tequila, Tropical Gin, Sherry, White Soy, Sake, Kombu, Mezcal, Sushi Cracker.',
    abv: 4,
    sweetness: 2,
    choices: [],
    isEnding: true
  },
  '711_sweets_ending': {
    id: '711_sweets_ending',
    title: '7-ELEVEN SUGAR RUSH',
    corePrompt: 'You came for culture, but you stayed for the ham-and-cheese toasties and neon sugar. A pure, unadulterated Bangkok high.',
    recipe: 'Spiced Rum, Tea, Coconut & Palm Reduction, Jasmine Rice, Creme De Cacao, Yuzu Cranberry Biscotti.',
    abv: 3,
    sweetness: 4,
    choices: [],
    isEnding: true
  },
  'sukhumvit_ending': {
    id: 'sukhumvit_ending',
    title: 'SUKHUMVIT AFTER DARK',
    corePrompt: 'Flashy, fruity, and dangerously confident—like Bangkok at 1:17 a.m. You’re ready to own the night.',
    recipe: 'Saffron and Blue Pea Vodka, Tonka Tincture, Lychee, Prosecco, Clear Lemon.',
    abv: 3,
    sweetness: 3,
    choices: [],
    isEnding: true
  },
  'chao_phraya_ending': {
    id: 'chao_phraya_ending',
    title: 'SUNSET AT CHAO PHRAYA',
    corePrompt: 'The sky is a palette of orange and purple. For exactly one drink, you are the main character of a high-budget travel vlog.',
    recipe: 'Bergamot, Peach, St.Germain, Earl Grey, Grapefruit Soda.',
    abv: 1,
    sweetness: 2,
    choices: [],
    isEnding: true
  },
  'hotel_lobby_ending': {
    id: 'hotel_lobby_ending',
    title: 'HOTEL LOBBY DRAMS',
    corePrompt: 'In the sanctuary of marble and air conditioning. You sit straighter. You tip better. You start saying “neat.” Classy move.',
    recipe: 'Blended Scotch, Fernet Branca, Campari Cask Tales, Butterscotch, Palo Cortado, Smoky Malt, Comte Cheese.',
    abv: 5,
    sweetness: 1,
    choices: [],
    isEnding: true
  },
  'bts_skyline_ending': {
    id: 'bts_skyline_ending',
    title: 'BTS HIGHBALL',
    corePrompt: 'Clean, tall, and refreshing. The city moves fast outside the glass window as you glide above the traffic jams. Total efficiency.',
    recipe: 'Reposado Tequila, Martini Bianco, Blue Curacao, Rose, Hops, Bubbles.',
    abv: 4,
    sweetness: 2,
    choices: [],
    isEnding: true
  },
  'chatuchak_ending': {
    id: 'chatuchak_ending',
    title: 'LOST IN CHATUCHAK',
    corePrompt: 'A sweet-sour reward for surviving the heat, the crowds, and the intense bargaining. You found the perfect vintage shirt.',
    recipe: 'Guava, Thai Chili, Jasmine, Tamarind, Bubbles.',
    abv: 0,
    sweetness: 2,
    choices: [],
    isEnding: true
  },
  'massage_ending': {
    id: 'massage_ending',
    title: 'TEMPLE RUN',
    corePrompt: 'You step through the gates: mango sun, jasmine whispers, pandan warmth, and a soft coconut hush—history welcomes you.',
    recipe: 'Mango, Coconut, Jasmine Rice, Pandan, Chocolate.',
    abv: 0,
    sweetness: 4,
    choices: [],
    isEnding: true
  }
};
