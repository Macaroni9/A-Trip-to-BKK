import React, { useState, useEffect, useCallback } from 'react';
import { STORY_DATA } from './constants/story';
import { GameState } from './types';
// FIXED: Import path is singular 'geminiService'
import { generateSceneContent, generateSceneImage } from './services/geminiService';
import { ChoiceButton } from './components/ChoiceButton';

const LOADING_MESSAGES = [
  "Hailing a Tuk-Tuk...",
  "Crossing the Chao Phraya...",
  "Ordering a spicy papaya salad...",
  "Escaping the 7-Eleven A/C...",
  "Navigating the night market...",
  "Mixing the perfect spirit..."
];

// A safe fallback image if everything goes wrong
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&fit=crop";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentSceneId: 'start',
    inventory: [],
    history: [],
    isGenerating: false,
    currentText: '',
    currentImageUrl: null
  });

  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);

  const loadScene = useCallback(async (sceneId: string) => {
    const scene = STORY_DATA[sceneId];
    if (!scene) return;

    setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    
    setGameState(prev => ({ 
      ...prev, 
      isGenerating: true,
      currentSceneId: sceneId 
    }));

    // 1. Get Text (with error handling)
    const textPromise = generateSceneContent(scene.corePrompt).catch(err => {
      console.error("Text Gen Error:", err);
      return "The humid air of Bangkok embraces you as the city lights flicker to life...";
    });

    // 2. Get Image (with error handling)
    const imagePromise = generateSceneImage(scene.corePrompt).catch(err => {
      console.error("Image Gen Error:", err);
      return DEFAULT_IMAGE;
    });

    let [narration, imageUrl] = await Promise.all([textPromise, imagePromise]);

    // Safety: Ensure we have a string
    if (!imageUrl) imageUrl = DEFAULT_IMAGE;

    setGameState(prev => ({
      ...prev,
      currentText: narration,
      currentImageUrl: imageUrl,
      isGenerating: false,
      history: [...prev.history, sceneId]
    }));
  }, []);

  useEffect(() => {
    loadScene('start');
  }, [loadScene]);

  const handleChoice = (nextId: string) => {
    if (gameState.isGenerating) return;
    loadScene(nextId);
  };

  const restartGame = () => {
    loadScene('start');
  };

  const currentScene = STORY_DATA[gameState.currentSceneId];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 animate-fade-in">
        <div>
          <h1 className="text-sm tracking-[0.5em] uppercase text-magenta-500 font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
            TRIP TO BANGKOK
          </h1>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">A Bangkok Itinerary</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={restartGame}
            className="text-[10px] px-3 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-600 text-zinc-400 transition-colors uppercase tracking-widest"
          >
            New Trip
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-8 pb-20">
        {/* Visual Container */}
        <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/50 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {gameState.currentImageUrl && !gameState.isGenerating ? (
            <img 
              /* KEY FIX: This forces React to reload the image even if the URL looks similar */
              key={gameState.currentImageUrl} 
              src={gameState.currentImageUrl} 
              alt="Bangkok Scene" 
              className="w-full h-full object-cover animate-fade-in"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 w-16 h-16 border-2 border-cyan-500/10 border-b-cyan-500 rounded-full animate-spin [animation-duration:1.5s]" />
                </div>
                <p className="text-sm font-medium tracking-widest text-zinc-400 animate-pulse uppercase">{loadingMsg}</p>
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
        </div>

        {/* Narrative Text */}
        <div className="min-h-[160px] px-4">
          {gameState.isGenerating ? (
            <div className="space-y-4">
              <div className="h-4 bg-zinc-900 rounded-full w-full animate-pulse" />
              <div className="h-4 bg-zinc-900 rounded-full w-4/5 animate-pulse" />
              <div className="h-4 bg-zinc-900 rounded-full w-2/3 animate-pulse" />
            </div>
          ) : (
            <div className="animate-fade-in">
              <span className="text-fuchsia-500 text-xs font-bold uppercase tracking-widest mb-2 block">
                {currentScene?.isEnding ? 'Your Spirit Revealed' : 'Current Vibe'}
              </span>
              <h2 className="serif italic text-3xl md:text-4xl mb-4 text-white leading-tight">
                {currentScene?.title}
              </h2>
              <p className="text-lg md:text-xl leading-relaxed text-zinc-400 font-light max-w-3xl">
                {gameState.currentText}
              </p>
            </div>
          )}
        </div>

        {/* Choices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!gameState.isGenerating && currentScene?.choices.map((choice) => (
            <ChoiceButton 
              key={choice.id}
              text={choice.text}
              onClick={() => handleChoice(choice.nextSceneId)}
              disabled={gameState.isGenerating}
            />
          ))}
          
          {currentScene?.isEnding && !gameState.isGenerating && (
            <div className="col-span-full flex flex-col items-center mt-8 py-12 border-t border-zinc-900/50 bg-gradient-to-b from-transparent to-fuchsia-950/10 rounded-3xl">
              <p className="text-zinc-500 mb-8 uppercase tracking-[0.3em] text-[10px] font-black">Trip Completed</p>
              <button 
                onClick={restartGame}
                className="group relative px-12 py-5 overflow-hidden rounded-full bg-white text-black font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
              >
                <span className="relative z-10">Fly Again</span>
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Ambient Stats */}
      <footer className="fixed bottom-0 left-0 w-full p-6 flex justify-between text-[9px] tracking-widest uppercase text-zinc-700 pointer-events-none">
        <div className="flex gap-4">
          <span>LAT: 13.7563° N</span>
          <span>LON: 100.5018° E</span>
        </div>
        <div className="flex gap-4">
          <span>TEMP: 32°C</span>
          <span>MOOD: {gameState.isGenerating ? 'SHIFTING' : 'STABLE'}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
