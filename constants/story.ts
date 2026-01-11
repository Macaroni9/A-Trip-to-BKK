
import { Scene } from '../types';

export const STORY_DATA: Record<string, Scene> = {
  'start': {
    id: 'start',
    title: 'Touchdown in Suvarnabhumi',
    corePrompt: 'The humidity hits you like a warm hug as you step out of the airport. The smell of jet fuel and orchids fills the air. Bangkok is waiting.',
    choices: [
      { id: 'c1', text: '“Drop my bags and chase chaos.”', nextSceneId: '2A' },
      { id: 'c2', text: '“Slow down; I want Bangkok to feel like a movie.”', nextSceneId: '2B' }
    ]
  },
  // CHAOS PATH
  '2A': {
    id: '2A',
    title: 'A Night Owl’s Test',
    corePrompt: 'The city pulses with bass and neon. Motorbikes weave through traffic like schools of fish. Where do you dive in?',
    choices: [
      { id: 'c3', text: '“Neon streets, buckets, and bad decisions.”', nextSceneId: 'khaosan_ending' },
      { id: 'c4', text: '“I want the city to hit me with flavor first.”', nextSceneId: '3A' }
    ]
  },
  '3A': {
    id: '3A',
    title: 'First Proper Bite',
    corePrompt: 'The air is thick with the scent of grilled pork and lemongrass. Street vendors are busy, and the crowds are thick.',
    choices: [
      { id: 'c5', text: '“Street food carnival—smoke, spice, crowds.”', nextSceneId: 'jodd_fairs_ending' },
      { id: 'c6', text: '“Something dessert-like from a 7-Eleven.”', nextSceneId: '4A' }
    ]
  },
  '4A': {
    id: '4A',
    title: 'The Sweetest Craving',
    corePrompt: 'The heat is real. You need a sugar rush to keep the momentum going. What’s the move?',
    choices: [
      { id: 'c7', text: '“7-Eleven sweets, guilty joy.”', nextSceneId: '711_sweets_ending' },
      { id: 'c8', text: '“I want a ‘fancy messy’ dessert moment.”', nextSceneId: 'sukhumvit_ending' }
    ]
  },
  // MOVIE PATH
  '2B': {
    id: '2B',
    title: 'The Bangkok Postcard',
    corePrompt: 'You’re looking for that cinematic glow. The city looks softer from a distance, like a dream in gold and blue.',
    choices: [
      { id: 'c9', text: '“Water + skyline = I’m in a music video.”', nextSceneId: '3B' },
      { id: 'c10', text: '“Temples, old streets, and time travel vibes.”', nextSceneId: '4B' }
    ]
  },
  '3B': {
    id: '3B',
    title: 'Riverside Magic',
    corePrompt: 'The Chao Phraya river reflects the city lights like a liquid mirror. The breeze is finally cool.',
    choices: [
      { id: 'c11', text: '“Golden hour, breezy, light, sparkly.”', nextSceneId: 'chao_phraya_ending' },
      { id: 'c12', text: '“Quiet, classy, slow-sip energy.”', nextSceneId: 'hotel_lobby_ending' }
    ]
  },
  '4B': {
    id: '4B',
    title: 'Temple Day Discovery',
    corePrompt: 'The spires of Wat Arun glisten in the sun. It’s majestic, spiritual, and incredibly hot. How are we moving?',
    choices: [
      { id: 'c13', text: '“River boat / BTS / easy ride—keep it crisp.”', nextSceneId: 'bts_skyline_ending' },
      { id: 'c14', text: '“Too hot. I need a non-alcohol reset first.”', nextSceneId: '5B' }
    ]
  },
  '5B': {
    id: '5B',
    title: 'The Great Reset',
    corePrompt: 'Your senses are overloaded. You need to ground yourself before the next adventure.',
    choices: [
      { id: 'c15', text: '“Iconic tourist-proof: market + hustle.”', nextSceneId: 'chatuchak_ending' },
      { id: 'c16', text: '“I want to be reborn: spa / massage / calm.”', nextSceneId: 'massage_ending' }
    ]
  },
  // ENDINGS
  'khaosan_ending': {
    id: 'khaosan_ending',
    title: 'KHAOSAN ROAD',
    corePrompt: 'The music is deafening, the buckets are strong. You black out politely and wake up with glitter in your pocket and a smile on your face.',
    choices: [],
    isEnding: true
  },
  'jodd_fairs_ending': {
    id: 'jodd_fairs_ending',
    title: 'JODD FAIRS',
    corePrompt: 'Surrounded by the glow of the night market. You sweat, you smile, and you pretend you can handle Thai spicy. Your soul feels seasoned.',
    choices: [],
    isEnding: true
  },
  '711_sweets_ending': {
    id: '711_sweets_ending',
    title: '7-ELEVEN SWEET RUN',
    corePrompt: 'You came for culture, but you stayed for the ham-and-cheese toasties and neon sugar. A pure, unadulterated Bangkok high.',
    choices: [],
    isEnding: true
  },
  'sukhumvit_ending': {
    id: 'sukhumvit_ending',
    title: 'SUKHUMVIT AFTER DARK',
    corePrompt: 'Flashy, fruity, and dangerously confident—like Bangkok at 1:17 a.m. You’re ready to own the night.',
    choices: [],
    isEnding: true
  },
  'chao_phraya_ending': {
    id: 'chao_phraya_ending',
    title: 'CHAO PHRAYA SUNSET',
    corePrompt: 'The sky is a palette of orange and purple. For exactly one drink, you are the main character of a high-budget travel vlog.',
    choices: [],
    isEnding: true
  },
  'hotel_lobby_ending': {
    id: 'hotel_lobby_ending',
    title: 'BANGKOK HOTEL LOBBY',
    corePrompt: 'In the sanctuary of marble and air conditioning. You sit straighter. You tip better. You start saying “neat.” Classy move.',
    choices: [],
    isEnding: true
  },
  'bts_skyline_ending': {
    id: 'bts_skyline_ending',
    title: 'BTS SKYLINE RIDE',
    corePrompt: 'Clean, tall, and refreshing. The city moves fast outside the glass window as you glide above the traffic jams. Total efficiency.',
    choices: [],
    isEnding: true
  },
  'chatuchak_ending': {
    id: 'chatuchak_ending',
    title: 'CHATUCHAK QUEST',
    corePrompt: 'A sweet-sour reward for surviving the heat, the crowds, and the intense bargaining. You found the perfect vintage shirt.',
    choices: [],
    isEnding: true
  },
  'massage_ending': {
    id: 'massage_ending',
    title: 'THAI MASSAGE RESET',
    corePrompt: 'You walk out lighter, hydrated, and emotionally unbothered. The city’s noise feels like a distant lullaby now.',
    choices: [],
    isEnding: true
  }
};
