
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { STORY_DATA } from './constants/story';
import { GameState } from './types';
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

const DEFAULT_IMAGE = "https://i.ibb.co/VYvVcV94/original.png";

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentSceneId: 'start',
    inventory: [],
    history: [],
    isGenerating: false,
    currentText: '',
    currentImageUrl: null
  });

  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [isSkipMenuOpen, setIsSkipMenuOpen] = useState(false);

  const endings = useMemo(() => {
    return Object.values(STORY_DATA).filter(scene => scene.isEnding);
  }, []);

  const loadScene = useCallback(async (sceneId: string, isBackNav: boolean = false) => {
    const scene = STORY_DATA[sceneId];
    if (!scene) return;

    setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    
    setGameState(prev => ({ 
      ...prev, 
      isGenerating: true,
      currentSceneId: sceneId 
    }));

    try {
      const textPromise = generateSceneContent(scene.corePrompt).catch(err => {
        console.error("Text Gen Error:", err);
        return scene.corePrompt;
      });

      const imagePromise = generateSceneImage(sceneId).catch(err => {
        console.error("Image Gen Error:", err);
        return DEFAULT_IMAGE;
      });

      let [narration, imageUrl] = await Promise.all([textPromise, imagePromise]);

      if (!imageUrl) imageUrl = DEFAULT_IMAGE;

      setGameState(prev => {
        const newHistory = isBackNav ? prev.history : [...prev.history, sceneId];
        return {
          ...prev,
          currentText: narration,
          currentImageUrl: imageUrl,
          isGenerating: false,
          history: newHistory
        };
      });

    } catch (error) {
      console.error("Scene Load Error:", error);
      setGameState(prev => ({
        ...prev,
        isGenerating: false,
        currentImageUrl: DEFAULT_IMAGE
      }));
    }
  }, []);

  const startGame = () => {
    setIsStarted(true);
    loadScene('start');
  };

  const handleChoice = (nextId: string) => {
    if (gameState.isGenerating) return;
    loadScene(nextId);
  };

  const handleBack = () => {
    if (gameState.history.length <= 1 || gameState.isGenerating) return;
    
    const historyCopy = [...gameState.history];
    historyCopy.pop();
    const previousSceneId = historyCopy[historyCopy.length - 1];
    
    setGameState(prev => ({
      ...prev,
      history: historyCopy
    }));
    
    loadScene(previousSceneId, true);
  };

  const handleSkipToEnding = (endingId: string) => {
    setIsSkipMenuOpen(false);
    setIsStarted(true);
    loadScene(endingId);
  };

  const restartToLanding = () => {
    setIsSkipMenuOpen(false);
    setIsStarted(false);
    setGameState({
      currentSceneId: 'start',
      inventory: [],
      history: [],
      isGenerating: false,
      currentText: '',
      currentImageUrl: null
    });
  };

  const currentScene = STORY_DATA[gameState.currentSceneId];

  // Landing Page Render
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl w-full space-y-8 animate-fade-in">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-[0_0_80px_rgba(217,70,239,0.15)] border border-zinc-800">
            <img 
              src={DEFAULT_IMAGE} 
              alt="Bangkok Skyline" 
              className="w-full h-full object-cover brightness-[0.6]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 mb-2">
                A TRIP TO BANGKOK
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-fuchsia-600 to-cyan-500 rounded-full" />
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xl md:text-2xl text-zinc-300 font-light leading-relaxed">
              In this journey, <span className="text-fuchsia-400 font-medium">you are the main character</span>. 
            </p>
            <p className="text-zinc-500 text-lg leading-relaxed max-w-lg mx-auto">
              Every choice you make in the chaotic neon streets or serene riversides will shift your path. 
              At the end of your trip, a signature cocktail awaits, mixed perfectly to match your unique Bangkok spirit.
            </p>
          </div>

          <div className="pt-8 flex flex-col items-center gap-4">
            <button 
              onClick={startGame}
              className="group relative px-16 py-6 overflow-hidden rounded-full bg-white text-black font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              <span className="relative z-10 text-lg">Start Your Story</span>
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button 
              onClick={() => setIsSkipMenuOpen(true)}
              className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 hover:text-fuchsia-400 transition-colors"
            >
              Or Jump to Endings
            </button>
          </div>
        </div>

        {/* Re-using the Skip Modal here just in case they want it on landing */}
        {isSkipMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
            <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Ending Gallery</h2>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Jump directly to any cocktail reveal</p>
                </div>
                <button 
                  onClick={() => setIsSkipMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {endings.map((ending) => (
                  <button
                    key={ending.id}
                    onClick={() => handleSkipToEnding(ending.id)}
                    className="group p-4 rounded-2xl border border-zinc-900 bg-zinc-900/50 hover:border-fuchsia-500/50 transition-all text-left"
                  >
                    <span className="block text-[10px] text-fuchsia-500 uppercase font-black tracking-widest mb-1">Ending</span>
                    <span className="block text-zinc-200 group-hover:text-white font-medium transition-colors">{ending.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Game Render
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8 animate-fade-in gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-sm tracking-[0.5em] uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
            A TRIP TO BANGKOK
          </h1>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">A Bangkok Itinerary</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {gameState.history.length > 1 && (
            <button 
              onClick={handleBack}
              disabled={gameState.isGenerating}
              className="text-[10px] px-3 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-600 text-zinc-400 transition-colors uppercase tracking-widest disabled:opacity-30"
            >
              ← Back
            </button>
          )}
          <button 
            onClick={() => setIsSkipMenuOpen(true)}
            className="text-[10px] px-3 py-1.5 rounded-full border border-fuchsia-900/50 bg-fuchsia-950/10 hover:bg-fuchsia-900/20 text-fuchsia-400 transition-colors uppercase tracking-widest"
          >
            Skip Story
          </button>
          <button 
            onClick={restartToLanding}
            className="text-[10px] px-3 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-600 text-zinc-400 transition-colors uppercase tracking-widest"
          >
            New Trip
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-8 pb-20">
        
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/50 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {gameState.currentImageUrl && !gameState.isGenerating ? (
            <img 
              key={gameState.currentImageUrl} 
              src={gameState.currentImageUrl} 
              alt="Bangkok Scene" 
              className="w-full h-full object-cover animate-fade-in"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
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

        {/* TEXT CONTAINER */}
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

        {/* CHOICES CONTAINER */}
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
                onClick={restartToLanding}
                className="group relative px-12 py-5 overflow-hidden rounded-full bg-white text-black font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
              >
                <span className="relative z-10">Fly Again</span>
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Skip Story Modal */}
      {isSkipMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Ending Gallery</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Jump directly to any cocktail reveal</p>
              </div>
              <button 
                onClick={() => setIsSkipMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {endings.map((ending) => (
                <button
                  key={ending.id}
                  onClick={() => handleSkipToEnding(ending.id)}
                  className="group p-4 rounded-2xl border border-zinc-900 bg-zinc-900/50 hover:border-fuchsia-500/50 transition-all text-left"
                >
                  <span className="block text-[10px] text-fuchsia-500 uppercase font-black tracking-widest mb-1">Ending</span>
                  <span className="block text-zinc-200 group-hover:text-white font-medium transition-colors">{ending.title}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsSkipMenuOpen(false)}
                className="text-xs text-zinc-500 hover:text-zinc-300 uppercase tracking-widest underline underline-offset-4"
              >
                Return to current choice
              </button>
            </div>
          </div>
        </div>
      )}

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
