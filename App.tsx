
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { STORY_DATA } from './constants/story';
import { GameState } from './types';
import { generateSceneContent, generateSceneImage } from './services/geminiService';
import { ChoiceButton } from './components/ChoiceButton';

const LOADING_MESSAGES = [
  "Calling a Win Bike...",
  "Crossing the Chao Phraya...",
  "Exploring the night market...",
  "Capturing the skyline...",
  "Bargaining a Tuk-Tuk...",
  "Debating to go Soi Cowboy..."
];

const DEFAULT_IMAGE = "https://i.ibb.co/JjVp3qBp/original-17.png";

const Hearts: React.FC<{ rating: number; label: string }> = ({ rating, label }) => {
  const fullHearts = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  
  return (
    <div className="flex flex-col items-center md:items-start">
      <span className="text-[14px] font-arcade text-zinc-500 uppercase tracking-widest mb-1">{label}</span>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => {
          if (i < fullHearts) {
            return <span key={i} className="text-red-600">❤</span>;
          } else if (i === fullHearts && hasHalf) {
            return <span key={i} className="text-red-600 relative overflow-hidden inline-block w-[0.5em]">❤<span className="absolute left-0 top-0 text-zinc-800">❤</span></span>;
          } else {
            return <span key={i} className="text-zinc-800">❤</span>;
          }
        })}
      </div>
    </div>
  );
};

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
  const [pendingGalleryIndex, setPendingGalleryIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Real-time temperature state
  const [currentTemp, setCurrentTemp] = useState('32');
  const [tempSource, setTempSource] = useState<{ uri: string; title: string } | null>(null);

  useEffect(() => {
    const fetchRealTimeTemp = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=13.7563&longitude=100.5018&current=temperature_2m&timezone=Asia%2FBangkok"
        );
        if (!response.ok) throw new Error("Weather API failed");
        const data = await response.json();
        if (data.current && data.current.temperature_2m !== undefined) {
          const temp = Math.round(data.current.temperature_2m).toString();
          setCurrentTemp(temp);
          setTempSource({
            uri: "https://open-meteo.com",
            title: "Open-Meteo Weather Data"
          });
        }
      } catch (error) {
        console.warn("Weather sync failed, using default (32°C).", error);
      }
    };
    fetchRealTimeTemp();
    const interval = setInterval(fetchRealTimeTemp, 1800000);
    return () => clearInterval(interval);
  }, []);

  // Effect to handle programmatic scrolling of the gallery
  useEffect(() => {
    if (!gameState.isGenerating && pendingGalleryIndex !== null && galleryRef.current) {
      const container = galleryRef.current;
      const width = container.offsetWidth;
      container.scrollTo({ left: width * pendingGalleryIndex, behavior: 'auto' });
      setGalleryIndex(pendingGalleryIndex);
      setPendingGalleryIndex(null);
    }
  }, [gameState.isGenerating, pendingGalleryIndex, gameState.currentImageUrls]);

  const endings = useMemo(() => {
    return Object.values(STORY_DATA).filter(scene => scene.isEnding);
  }, []);

  const loadScene = useCallback(async (sceneId: string, isBackNav: boolean = false, initialIndex: number = 0) => {
    const scene = STORY_DATA[sceneId];
    if (!scene) return;

    setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    setGalleryIndex(initialIndex); 
    setPendingGalleryIndex(initialIndex);
    
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
    // Jump to the ending and default to the drink image (index 1)
    loadScene(endingId, false, 1);
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

  const displayNarration = useMemo(() => {
    if (currentScene?.isEnding && galleryIndex === 1 && currentScene.recipe) {
      return currentScene.recipe;
    }
    return gameState.currentText;
  }, [currentScene, galleryIndex, gameState.currentText]);

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#080c14] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl w-full space-y-12 animate-fade-in">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-8 shadow-2xl">
            <img 
              src={DEFAULT_IMAGE} 
              alt="Bangkok Skyline" 
              className="w-full h-full object-cover brightness-[0.4]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <h1 
                className="text-4xl md:text-6xl font-arcade font-bold tracking-tight text-white mb-4 glitch"
                data-text="BANGKOK QUEST"
              >
                BANGKOK QUEST
              </h1>
            </div>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            <p className="text-2xl md:text-3xl font-arcade text-arcade-accent leading-relaxed">
              YOUR JOURNEY AWAITS
            </p>
            <p className="text-zinc-300 text-xl leading-relaxed font-medium">
              Every decision you make amidst the neon temples or vibrant streets will define your narrative. 
              At your journey's conclusion, a bespoke cocktail awaits—curated to match the spirit of your travels.
            </p>
          </div>

          <div className="pt-8 flex flex-col items-center gap-6">
            <button 
              onClick={startGame}
              className="group relative px-20 py-6 bg-white text-black font-arcade text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-arcade-choice/20 to-arcade-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">INITIATE QUEST</span>
            </button>
            <button 
              onClick={() => setIsSkipMenuOpen(true)}
              className="text-[10px] font-arcade text-zinc-500 hover:text-white transition-colors tracking-[0.2em]"
            >
              [ BYPASS TO ENDINGS ]
            </button>
          </div>
        </div>

        {isSkipMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-black border-4 border-arcade-accent p-8 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_var(--arcade-accent)]">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-arcade font-bold text-arcade-accent tracking-tight">SELECT LEVEL</h2>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Direct access to all cocktail reveals</p>
                </div>
                <button 
                  onClick={() => setIsSkipMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center border-2 border-arcade-accent text-arcade-accent hover:bg-arcade-accent hover:text-black transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {endings.map((ending) => (
                  <button
                    key={ending.id}
                    onClick={() => handleSkipToEnding(ending.id)}
                    className="group p-6 border-2 border-zinc-800 bg-black hover:border-arcade-secondary hover:shadow-[0_0_15px_var(--arcade-secondary)] transition-all text-left"
                  >
                    <span className="block text-[10px] text-arcade-secondary uppercase font-arcade mb-2 opacity-70">Ending</span>
                    <span className="block text-zinc-200 group-hover:text-arcade-secondary font-arcade text-xs transition-colors">{ending.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-zinc-200 flex flex-col items-center p-4 md:p-10">
      <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-12 animate-fade-in gap-6">
        <div className="text-center md:text-left">
          <h1 
            className="text-xl font-arcade font-bold text-arcade-accent uppercase tracking-wider glitch"
            data-text="BANGKOK QUEST"
          >
            BANGKOK QUEST
          </h1>
          <p className="text-[10px] text-arcade-secondary mt-2 uppercase tracking-[0.3em] font-arcade">Your Journey Has Begun</p>
        </div>
          <div className="flex flex-wrap justify-center gap-8">
          {gameState.history.length > 1 && (
            <button 
              onClick={handleBack}
              disabled={gameState.isGenerating}
              className="text-[10px] font-arcade text-zinc-500 hover:text-arcade-secondary transition-colors disabled:opacity-20 uppercase tracking-widest"
            >
              [ back ]
            </button>
          )}
          <button 
            onClick={() => setIsSkipMenuOpen(true)}
            className="text-[10px] font-arcade text-zinc-500 hover:text-arcade-choice transition-colors uppercase tracking-widest"
          >
            [ endings ]
          </button>
          <button 
            onClick={restartToLanding}
            className="text-[10px] font-arcade text-zinc-500 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            [ restart ]
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl flex flex-col gap-10">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 shadow-2xl group rounded-2xl">
          {gameState.currentImageUrls && gameState.currentImageUrls.length > 0 && !gameState.isGenerating ? (
            <div className="w-full h-full relative">
              <div 
                ref={galleryRef}
                className="w-full h-full flex transition-transform duration-700 ease-in-out scrollbar-hide snap-x snap-mandatory overflow-x-auto"
                onScroll={(e) => {
                  const scrollPos = e.currentTarget.scrollLeft;
                  const width = e.currentTarget.offsetWidth;
                  if (width > 0) {
                    setGalleryIndex(Math.round(scrollPos / width));
                  }
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
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-t-4 border-white rounded-full animate-spin opacity-60" />
                <p className="text-xs font-arcade tracking-[0.4em] text-white uppercase">{loadingMsg}</p>
              </div>
            </div>
          )}
        </div>

        {/* Swipe Instructions and Indicators Below Image */}
        {gameState.currentImageUrls && gameState.currentImageUrls.length > 1 && !gameState.isGenerating && (
          <div className="flex flex-col items-center gap-6 -mt-6 animate-fade-in">
            <div className="flex gap-2">
              {gameState.currentImageUrls.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 transition-all duration-300 ${galleryIndex === idx ? 'w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
            <div className="flex justify-center gap-10">
              <div className={`flex items-center gap-2 text-[8px] font-arcade uppercase tracking-widest transition-opacity duration-300 ${galleryIndex === 0 ? 'text-white opacity-100' : 'text-zinc-600 opacity-40'}`}>
                <span className="animate-pulse">←</span> Swipe for Spirit
              </div>
              <div className={`flex items-center gap-2 text-[8px] font-arcade uppercase tracking-widest transition-opacity duration-300 ${galleryIndex === 1 ? 'text-white opacity-100' : 'text-zinc-600 opacity-40'}`}>
                Swipe for Story <span className="animate-pulse">→</span>
              </div>
            </div>
          </div>
        )}

        <div className="min-h-[140px] px-2 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {gameState.isGenerating ? (
              <div className="space-y-4 max-w-2xl">
                <div className="h-5 bg-zinc-900 rounded-full w-full animate-pulse" />
                <div className="h-5 bg-zinc-900 rounded-full w-4/5 animate-pulse" />
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
                  <div>
                    <span className="text-arcade-accent text-[10px] font-arcade uppercase tracking-[0.4em] mb-4 block opacity-80">
                      {currentScene?.isEnding ? (galleryIndex === 0 ? 'LEVEL COMPLETE' : 'DRINK STATS') : 'CURRENT SCENE'}
                    </span>
                    <h2 className="font-arcade text-2xl md:text-3xl text-white tracking-tight">
                      {currentScene?.title}
                    </h2>
                  </div>
                  
                  {currentScene?.isEnding && galleryIndex === 1 && (currentScene.abv !== undefined || currentScene.sweetness !== undefined) && (
                    <div className="flex gap-6 animate-fade-in">
                      {currentScene.abv !== undefined && <Hearts label="ABV" rating={currentScene.abv} />}
                      {currentScene.sweetness !== undefined && <Hearts label="Sweetness" rating={currentScene.sweetness} />}
                    </div>
                  )}
                </div>
                
                <p className="text-2xl md:text-3xl leading-relaxed text-zinc-200 font-medium transition-all duration-500">
                  {displayNarration}
                </p>
              </div>
            )}
          </div>
        </div>

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
            <div className="col-span-full flex flex-col items-center mt-12 py-20 border-t border-white/5 bg-white/[0.02] rounded-3xl backdrop-blur-sm">
              <span className="text-zinc-500 mb-8 uppercase tracking-[0.5em] text-[10px] font-arcade">QUEST COMPLETE</span>
              <button 
                onClick={restartToLanding}
                className="group relative px-20 py-6 bg-white text-black font-arcade text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] rounded-full"
              >
                <span className="relative z-10">REPLAY JOURNEY</span>
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full max-w-5xl mt-20 pb-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-arcade uppercase text-zinc-600 border-t-2 border-zinc-800 pt-10">
        <div className="flex flex-wrap justify-center gap-8">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-arcade-accent/40" />
            LAT: 13.7214
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-arcade-accent/40" />
            LON: 100.5169
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-arcade-accent/40" />
            TEMP: {currentTemp}C
            {tempSource && (
              <a 
                href={tempSource.uri} 
                target="_blank" 
                rel="noopener noreferrer" 
                title={`Sourced from: ${tempSource.title}`}
                className="ml-1 opacity-30 hover:opacity-100 transition-opacity"
              >
                
              </a>
            )}
          </span>
        </div>
        <div className="flex gap-8">
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 transition-colors duration-500 ${gameState.isGenerating ? 'bg-arcade-secondary animate-pulse' : 'bg-arcade-accent/50'}`} />
            MOOD: {gameState.isGenerating ? 'SHIFTING' : 'STABLE'}
          </span>
        </div>
      </footer>

      {isSkipMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-black border-4 border-arcade-accent p-8 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_var(--arcade-accent)]">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-arcade font-bold text-arcade-accent tracking-tight">SELECT LEVEL</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-arcade">Jump to your final spirit</p>
              </div>
              <button 
                onClick={() => setIsSkipMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center border-2 border-arcade-accent text-arcade-accent hover:bg-arcade-accent hover:text-black transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {endings.map((ending) => (
                <button
                  key={ending.id}
                  onClick={() => handleSkipToEnding(ending.id)}
                  className="group p-6 border-2 border-zinc-800 bg-black hover:border-arcade-secondary hover:shadow-[0_0_15px_var(--arcade-secondary)] transition-all text-left"
                >
                  <span className="block text-[10px] text-arcade-secondary uppercase font-arcade mb-2 opacity-60">Result</span>
                  <span className="block text-zinc-200 group-hover:text-arcade-secondary font-arcade text-xs transition-colors leading-tight">{ending.title}</span>
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
