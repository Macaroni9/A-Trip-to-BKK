
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { STORY_DATA } from './constants/story';
import { GameState } from './types';
import { generateSceneContent, generateSceneImage } from './services/geminiService';
import { ChoiceButton } from './components/ChoiceButton';
import { GoogleGenAI } from "@google/genai";

const LOADING_MESSAGES = [
  "Calling a Win Bike...",
  "Crossing the Chao Phraya...",
  "Exploring the night market...",
  "Capturing the skyline...",
  "Bargaining a Tuk-Tuk...",
  "Debating to go Soi Cowboy..."
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
    currentImageUrl: null,
    currentImageUrls: []
  });

  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [isSkipMenuOpen, setIsSkipMenuOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  
  // Real-time temperature state
  const [currentTemp, setCurrentTemp] = useState('32');
  const [tempSource, setTempSource] = useState<{ uri: string; title: string } | null>(null);

  useEffect(() => {
    const fetchRealTimeTemp = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Find the current temperature in Bangkok, Thailand in Celsius. Use this specific source as a priority: https://www.accuweather.com/en/th/bangkok/318849/weather-forecast/318849. Return only the integer number representing the Celsius value.",
          config: {
            tools: [{ googleSearch: {} }]
          }
        });
        
        const text = result.text || "";
        // Match the first sequence of digits in the response
        const matches = text.match(/\d+/);
        if (matches) {
          setCurrentTemp(matches[0]);
        }
        
        const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks && chunks.length > 0) {
          const firstWebSource = chunks.find(chunk => chunk.web)?.web;
          if (firstWebSource) {
            setTempSource({
              uri: firstWebSource.uri,
              title: firstWebSource.title
            });
          }
        }
      } catch (error) {
        console.warn("Real-time temperature sync interrupted. Defaulting to standard seasonal data.", error);
      }
    };
    
    fetchRealTimeTemp();
    // Refresh temperature every 30 minutes if the tab stays open
    const interval = setInterval(fetchRealTimeTemp, 1800000);
    return () => clearInterval(interval);
  }, []);

  const endings = useMemo(() => {
    return Object.values(STORY_DATA).filter(scene => scene.isEnding);
  }, []);

  const loadScene = useCallback(async (sceneId: string, isBackNav: boolean = false) => {
    const scene = STORY_DATA[sceneId];
    if (!scene) return;

    setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    setGalleryIndex(0); // Reset gallery position
    
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

      let [narration, images] = await Promise.all([textPromise, imagePromise]);

      const imageUrls = Array.isArray(images) ? images : [images || DEFAULT_IMAGE];

      setGameState(prev => {
        const newHistory = isBackNav ? prev.history : [...prev.history, sceneId];
        return {
          ...prev,
          currentText: narration,
          currentImageUrl: imageUrls[0],
          currentImageUrls: imageUrls,
          isGenerating: false,
          history: newHistory
        };
      });

    } catch (error) {
      console.error("Scene Load Error:", error);
      setGameState(prev => ({
        ...prev,
        isGenerating: false,
        currentImageUrl: DEFAULT_IMAGE,
        currentImageUrls: [DEFAULT_IMAGE]
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
      currentImageUrl: null,
      currentImageUrls: []
    });
  };

  const currentScene = STORY_DATA[gameState.currentSceneId];

  // Landing Page Render
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl w-full space-y-12 animate-fade-in">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-8 shadow-2xl border border-zinc-800/50">
            <img 
              src={DEFAULT_IMAGE} 
              alt="Bangkok Skyline" 
              className="w-full h-full object-cover brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <h1 className="text-5xl md:text-7xl font-formal font-bold tracking-tight text-white mb-4">
                A Trip to Bangkok
              </h1>
              <div className="w-24 h-px bg-[#d4af37] opacity-60" />
            </div>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            <p className="text-2xl md:text-3xl font-formal italic text-zinc-200 leading-relaxed">
              In this journey, you are the architect of your own night. 
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed font-light">
              Every decision you make amidst the formal temples or vibrant streets will define your narrative. 
              At your journey's conclusion, a bespoke cocktail awaits—curated to match the spirit of your travels.
            </p>
          </div>

          <div className="pt-8 flex flex-col items-center gap-6">
            <button 
              onClick={startGame}
              className="group relative px-16 py-5 overflow-hidden rounded-full bg-white text-black font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <span className="relative z-10">Start Your Story</span>
              <div className="absolute inset-0 bg-[#d4af37] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
            <button 
              onClick={() => setIsSkipMenuOpen(true)}
              className="text-[11px] uppercase tracking-[0.4em] text-zinc-500 hover:text-[#d4af37] transition-colors border-b border-transparent hover:border-[#d4af37]/40 pb-1"
            >
              Skip to Endings
            </button>
          </div>
        </div>

        {isSkipMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-[#0c0c0e] border border-zinc-800 rounded-3xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-formal font-bold text-white tracking-tight">The Itineraries</h2>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Direct access to all cocktail reveals</p>
                </div>
                <button 
                  onClick={() => setIsSkipMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {endings.map((ending) => (
                  <button
                    key={ending.id}
                    onClick={() => handleSkipToEnding(ending.id)}
                    className="group p-6 rounded-2xl border border-zinc-900 bg-zinc-900/30 hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 transition-all text-left"
                  >
                    <span className="block text-[10px] text-[#d4af37] uppercase font-bold tracking-[0.2em] mb-2 opacity-70">Ending</span>
                    <span className="block text-zinc-200 group-hover:text-white font-formal text-lg transition-colors">{ending.title}</span>
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
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-200 flex flex-col items-center p-4 md:p-10">
      {/* Header */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-12 animate-fade-in gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-lg tracking-[0.5em] font-formal font-bold text-white uppercase">
            A Trip to Bangkok
          </h1>
          <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-[0.3em] font-medium">A PERSONALIZED JOURNEY</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {gameState.history.length > 1 && (
            <button 
              onClick={handleBack}
              disabled={gameState.isGenerating}
              className="text-[10px] font-semibold px-5 py-2 rounded-full border border-zinc-800 hover:border-zinc-700 text-zinc-400 transition-colors uppercase tracking-widest disabled:opacity-20"
            >
              Back
            </button>
          )}
          <button 
            onClick={() => setIsSkipMenuOpen(true)}
            className="text-[10px] font-semibold px-5 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 hover:border-[#d4af37]/40 text-zinc-300 transition-colors uppercase tracking-widest"
          >
            Endings
          </button>
          <button 
            onClick={restartToLanding}
            className="text-[10px] font-semibold px-5 py-2 rounded-full border border-zinc-800 hover:border-red-900/40 text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-widest"
          >
            Restart
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl flex flex-col gap-10">
        
        {/* IMAGE CONTAINER / GALLERY */}
        <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden bg-zinc-950 border border-zinc-800 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group">
          {gameState.currentImageUrls && gameState.currentImageUrls.length > 0 && !gameState.isGenerating ? (
            <div className="w-full h-full relative">
              <div 
                className="w-full h-full flex transition-transform duration-700 ease-in-out scrollbar-hide snap-x snap-mandatory overflow-x-auto"
                onScroll={(e) => {
                  const scrollPos = e.currentTarget.scrollLeft;
                  const width = e.currentTarget.offsetWidth;
                  setGalleryIndex(Math.round(scrollPos / width));
                }}
              >
                {gameState.currentImageUrls.map((url, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 snap-start relative">
                    <img 
                      src={url} 
                      alt={`Scene Image ${idx + 1}`} 
                      className="w-full h-full object-cover animate-fade-in"
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                    />
                  </div>
                ))}
              </div>

              {/* Gallery Controls for Multiple Images */}
              {gameState.currentImageUrls.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                  <div className="flex gap-2">
                    {gameState.currentImageUrls.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${galleryIndex === idx ? 'w-8 bg-[#d4af37]' : 'w-2 bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Swipe Indicator for Gallery */}
              {gameState.currentImageUrls.length > 1 && galleryIndex === 0 && (
                <div className="absolute top-1/2 right-6 -translate-y-1/2 flex flex-col items-center text-white/40 pointer-events-none animate-pulse">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] [writing-mode:vertical-lr]">Swipe to Reveal</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-t-2 border-[#d4af37] rounded-full animate-spin opacity-60" />
                <p className="text-xs font-semibold tracking-[0.4em] text-zinc-600 uppercase">{loadingMsg}</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>

        {/* NARRATIVE SECTION */}
        <div className="min-h-[140px] px-2 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {gameState.isGenerating ? (
              <div className="space-y-4 max-w-2xl">
                <div className="h-5 bg-zinc-900 rounded-full w-full animate-pulse" />
                <div className="h-5 bg-zinc-900 rounded-full w-4/5 animate-pulse" />
              </div>
            ) : (
              <div className="animate-fade-in">
                <span className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block opacity-80">
                  {currentScene?.isEnding ? 'You Have Reached...' : 'The Encounter'}
                </span>
                <h2 className="font-formal text-4xl md:text-5xl mb-4 text-white tracking-tight">
                  {currentScene?.title}
                </h2>
                <p className="text-xl md:text-2xl leading-relaxed text-zinc-400 font-light font-formal italic">
                  {gameState.currentText}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CHOICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
          {!gameState.isGenerating && currentScene?.choices.map((choice) => (
            <ChoiceButton 
              key={choice.id}
              text={choice.text}
              onClick={() => handleChoice(choice.nextSceneId)}
              disabled={gameState.isGenerating}
            />
          ))}
          
          {currentScene?.isEnding && !gameState.isGenerating && (
            <div className="col-span-full flex flex-col items-center mt-12 py-16 border-t border-zinc-800/30 bg-gradient-to-b from-[#d4af37]/5 to-transparent rounded-[3rem]">
              <span className="text-zinc-600 mb-8 uppercase tracking-[0.5em] text-[10px] font-bold">Experience Concluded</span>
              <button 
                onClick={restartToLanding}
                className="group relative px-16 py-5 overflow-hidden rounded-full bg-white text-black font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                <span className="relative z-10">New Itinerary</span>
                <div className="absolute inset-0 bg-[#d4af37] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER STATS - Now moves with content */}
      <footer className="w-full max-w-5xl mt-20 pb-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-semibold tracking-[0.4em] uppercase text-zinc-600 border-t border-zinc-800/20 pt-10">
        <div className="flex flex-wrap justify-center gap-8">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#d4af37]/40" />
            LAT: 13.7214° N
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#d4af37]/40" />
            LON: 100.5169° E
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#d4af37]/40" />
            TEMP: {currentTemp}°C
            {tempSource && (
              <a 
                href={tempSource.uri} 
                target="_blank" 
                rel="noopener noreferrer" 
                title={`Sourced from: ${tempSource.title}`}
                className="ml-1 opacity-30 hover:opacity-100 transition-opacity"
              >
                ⓘ
              </a>
            )}
          </span>
        </div>
        <div className="flex gap-8">
          <span className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${gameState.isGenerating ? 'bg-fuchsia-500 animate-pulse' : 'bg-green-500/50'}`} />
            MOOD: {gameState.isGenerating ? 'SHIFTING' : 'STABLE'}
          </span>
        </div>
      </footer>

      {/* Skip Story Modal */}
      {isSkipMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0c0c0e] border border-zinc-800 rounded-3xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-formal font-bold text-white tracking-tight">Ending Gallery</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-semibold">Jump to your final spirit</p>
              </div>
              <button 
                onClick={() => setIsSkipMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {endings.map((ending) => (
                <button
                  key={ending.id}
                  onClick={() => handleSkipToEnding(ending.id)}
                  className="group p-6 rounded-2xl border border-zinc-900 bg-zinc-900/40 hover:border-[#d4af37]/40 hover:bg-[#d4af37]/5 transition-all text-left"
                >
                  <span className="block text-[10px] text-[#d4af37] uppercase font-bold tracking-widest mb-2 opacity-60">Result</span>
                  <span className="block text-zinc-200 group-hover:text-white font-formal text-lg transition-colors leading-tight">{ending.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
