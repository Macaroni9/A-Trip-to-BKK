
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { STORY_DATA } from './constants/story';
import { GameState } from './types';
import { generateSceneContent, generateSceneImage } from './services/geminiService';
import { ChoiceButton } from './components/ChoiceButton';
import { Instagram, Share2, Download, CheckCircle2, X } from 'lucide-react';
import html2canvas from 'html2canvas';

const LOADING_MESSAGES = [
  "Calling a Win Bike...",
  "Crossing the Chao Phraya...",
  "Exploring the night market...",
  "Capturing the skyline...",
  "Bargaining a Tuk-Tuk...",
  "Debating to go Soi Cowboy..."
];

const DEFAULT_IMAGE = "https://i.ibb.co/JjVp3qBp/original-17.png";

const WatArunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 100" className={className} fill="currentColor">
    <path d="M32 0 L40 20 L32 15 L24 20 Z" />
    <rect x="28" y="20" width="8" height="10" />
    <path d="M20 30 L44 30 L40 50 L24 50 Z" />
    <rect x="15" y="50" width="34" height="10" />
    <path d="M10 60 L54 60 L50 90 L14 90 Z" />
    <rect x="5" y="90" width="54" height="10" />
  </svg>
);

const LebuaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 60 120" className={className} fill="currentColor">
    <rect x="10" y="30" width="40" height="90" />
    <circle cx="30" cy="25" r="12" fill="#FFD700" />
    <rect x="15" y="40" width="5" height="70" fill="rgba(255,255,255,0.2)" />
    <rect x="25" y="40" width="5" height="70" fill="rgba(255,255,255,0.2)" />
    <rect x="35" y="40" width="5" height="70" fill="rgba(255,255,255,0.2)" />
    <rect x="45" y="40" width="5" height="70" fill="rgba(255,255,255,0.2)" />
  </svg>
);

const MahanakhonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 50 130" className={className} fill="currentColor">
    <rect x="10" y="0" width="30" height="130" />
    {/* Pixelated cutouts */}
    <rect x="25" y="20" width="15" height="10" fill="black" />
    <rect x="10" y="40" width="10" height="15" fill="black" />
    <rect x="20" y="70" width="20" height="10" fill="black" />
    <rect x="10" y="90" width="15" height="15" fill="black" />
  </svg>
);

const NyanCat: React.FC<{ isRunning: boolean }> = ({ isRunning }) => {
  if (!isRunning) return null;
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      <div className="absolute top-1/2 -translate-y-1/2 animate-nyan flex items-center">
        {/* Rainbow Trail */}
        <div className="relative flex flex-col h-12 w-[2000px] -ml-[2000px]">
          <div className="flex-1 bg-[#ff0000]" />
          <div className="flex-1 bg-[#ff9900]" />
          <div className="flex-1 bg-[#ffff00]" />
          <div className="flex-1 bg-[#33ff00]" />
          <div className="flex-1 bg-[#0099ff]" />
          <div className="flex-1 bg-[#6633ff]" />
          {/* Text on the trail */}
          <div className="absolute inset-0 flex items-center justify-end pr-10">
            <span className="text-white font-arcade text-[10px] whitespace-nowrap drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] uppercase">
              Alright Hackerman..okay :(
            </span>
          </div>
        </div>
        {/* Cat Body */}
        <div className="relative w-16 h-12 bg-[#ffccff] border-2 border-black rounded-lg flex items-center justify-center">
          <div className="w-10 h-6 bg-[#ff3399] rounded-sm" />
          {/* Head */}
          <div className="absolute -right-4 top-1 w-8 h-8 bg-[#999999] border-2 border-black rounded-md">
            <div className="absolute left-1 top-2 w-1.5 h-1.5 bg-black rounded-full" />
            <div className="absolute right-1 top-2 w-1.5 h-1.5 bg-black rounded-full" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-1 w-2 h-1 bg-pink-400 rounded-full" />
          </div>
          {/* Feet */}
          <div className="absolute -bottom-1 left-2 w-3 h-2 bg-[#999999] border border-black rounded-full" />
          <div className="absolute -bottom-1 right-2 w-3 h-2 bg-[#999999] border border-black rounded-full" />
        </div>
      </div>
    </div>
  );
};

const TukTukIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className}>
    {/* Exhaust Smoke Particles - More defined puffs */}
    <circle className="smoke-particle" cx="6" cy="40" r="3" fill="#666" style={{ animationDelay: '0s' }} />
    <circle className="smoke-particle" cx="6" cy="40" r="2.5" fill="#888" style={{ animationDelay: '0.2s' }} />
    <circle className="smoke-particle" cx="6" cy="40" r="3.5" fill="#999" style={{ animationDelay: '0.4s' }} />
    <circle className="smoke-particle" cx="6" cy="40" r="2" fill="#aaa" style={{ animationDelay: '0.6s' }} />

    {/* Body - Navy Blue (Pixel Art Style) */}
    <rect x="12" y="32" width="40" height="12" fill="#1a3a8a" />
    <rect x="52" y="32" width="8" height="8" fill="#1a3a8a" />
    
    {/* Mudguards - Yellow */}
    <rect x="10" y="40" width="12" height="4" fill="#ffcc00" />
    <rect x="42" y="40" width="12" height="4" fill="#ffcc00" />
    
    {/* Roof - Blackish Grey */}
    <path d="M10 8 L50 8 L54 20 L6 20 Z" fill="#2a2a2a" />
    <rect x="25" y="4" width="4" height="4" fill="#666" /> {/* Antenna/Top detail */}
    
    {/* Roof Supports - Yellow */}
    <rect x="12" y="20" width="2" height="12" fill="#ffcc00" />
    <rect x="30" y="20" width="2" height="12" fill="#ffcc00" />
    <rect x="48" y="20" width="2" height="12" fill="#ffcc00" />
    
    {/* Seats - Red */}
    <rect x="18" y="28" width="10" height="4" fill="#cc0000" />
    <rect x="34" y="28" width="14" height="4" fill="#cc0000" />
    <rect x="44" y="24" width="4" height="4" fill="#cc0000" />
    
    {/* Handlebar */}
    <rect x="50" y="28" width="4" height="2" fill="#000" />
    
    {/* Windshield Area - Light Blue */}
    <rect x="50" y="20" width="4" height="8" fill="#88ccff" opacity="0.6" />
    
    {/* Wheels - Detailed Pixel Style */}
    <circle cx="16" cy="48" r="7" fill="#000" />
    <circle cx="16" cy="48" r="4" fill="#888" />
    <circle cx="16" cy="48" r="2" fill="#ffcc00" />
    
    <circle cx="48" cy="48" r="7" fill="#000" />
    <circle cx="48" cy="48" r="4" fill="#888" />
    <circle cx="48" cy="48" r="2" fill="#ffcc00" />
    
    {/* Headlight - Red/Yellow Accent */}
    <rect x="58" y="34" width="4" height="4" fill="#ff0000" />
    <rect x="60" y="35" width="2" height="2" fill="#ffff00" />
  </svg>
);

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
  const [isStarting, setIsStarting] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isSkipMenuOpen, setIsSkipMenuOpen] = useState(false);
  const [isNyanRunning, setIsNyanRunning] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [pendingGalleryIndex, setPendingGalleryIndex] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  
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
    if (isStarting) return;
    setIsStarting(true);
    
    // Start loading the first scene in the background immediately
    // This allows the TukTuk animation to act as the loading screen
    const sceneLoadPromise = loadScene('start');
    
    let progress = 0;
    const interval = setInterval(() => {
      // Slightly slower progress to give AI more time to generate the first scene
      progress += Math.random() * 10; 
      if (progress >= 100) {
        progress = 100;
        setLoadingProgress(100);
        clearInterval(interval);
        
        // Wait for the scene to finish loading before transitioning
        sceneLoadPromise.then(() => {
          setTimeout(() => {
            setIsStarted(true);
            setIsStarting(false);
            setLoadingProgress(0);
          }, 600);
        });
      } else {
        setLoadingProgress(Math.floor(progress));
      }
    }, 150);
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

  const handleShare = async () => {
    if (!shareCardRef.current || isSharing) return;
    
    setIsSharing(true);
    try {
      // Small delay to ensure images are fully rendered
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(shareCardRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#080c14',
        logging: false,
        allowTaint: true,
        imageTimeout: 15000,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      setShareImage(dataUrl);

      // Try native share if available
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], 'bangkok-quest.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            // This is the closest we can get to Spotify-like sharing in a web app
            // It triggers the native share sheet, where the user can select Instagram Stories
            await navigator.share({
              files: [file],
              title: 'Bangkok Quest',
              text: `My Bangkok Spirit: ${currentScene?.title}`,
            });
            setShareSuccess(true);
            setTimeout(() => setShareSuccess(false), 3000);
            return; 
          } catch (shareErr) {
            console.log('Native share failed', shareErr);
          }
        }
      }
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadShareImage = async () => {
    if (!shareImage) return;
    
    // Try to use the Share API first as it's the most reliable way to "save" on mobile
    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(shareImage);
        const blob = await response.blob();
        const file = new File([blob], 'bangkok-quest.png', { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Bangkok Quest',
            text: 'My Bangkok Spirit Drink Result',
          });
          return;
        }
      } catch (err) {
        console.error('Share API failed in download function', err);
      }
    }

    // Fallback for desktop or if Share API fails: standard download
    try {
      const link = document.createElement('a');
      link.href = shareImage;
      link.download = `bangkok-quest-result.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Standard download failed', err);
      // Last resort: open in new tab
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`
          <body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;">
            <img src="${shareImage}" style="max-width:100%;height:auto;" />
          </body>
        `);
      }
    }
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

  const handleBypassClick = () => {
    setIsNyanRunning(true);
    setTimeout(() => {
      setIsNyanRunning(false);
      setIsSkipMenuOpen(true);
    }, 5000);
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#080c14] text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <NyanCat isRunning={isNyanRunning} />
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
            <div className="relative w-full max-w-[340px]">
              {/* Scrolling Buildings - Positioned above the button */}
              {isStarting && (
                <div className="absolute bottom-[100%] left-0 w-full h-32 pointer-events-none overflow-hidden mb-[-4px]">
                  <div 
                    className="absolute inset-0 flex items-end justify-around w-[300%] animate-buildings-scroll"
                    style={{ animationDuration: '8s' }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-end gap-20 px-10">
                        <WatArunIcon className="w-12 h-16 text-white/10" />
                        <LebuaIcon className="w-10 h-20 text-white/10" />
                        <MahanakhonIcon className="w-8 h-24 text-white/10" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TukTuk Animation - Positioned on the top edge of the button */}
              <div 
                className="absolute transition-all duration-300 ease-in-out z-20"
                style={{ 
                  left: isStarting ? `${Math.max(8, Math.min(loadingProgress, 92))}%` : '1.5rem',
                  top: '0', 
                  opacity: 1,
                  transform: 'translate(-50%, -92%)',
                  pointerEvents: 'none'
                }}
              >
                <div className={isStarting ? 'vibrate-active' : 'vibrate-idle'}>
                  <TukTukIcon className="w-12 h-12 drop-shadow-[0_0_8px_rgba(26,58,138,0.5)]" />
                </div>
              </div>

              <button 
                onClick={startGame}
                disabled={isStarting}
                className="group relative w-full py-6 bg-white text-black font-arcade text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-full overflow-hidden"
              >
                {/* Loading Percentage */}
                {isStarting && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-arcade text-black/40 animate-pulse">
                    {loadingProgress}%
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-arcade-choice/20 to-arcade-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {!isStarting && <span className="relative z-10">INITIATE QUEST</span>}
              </button>
            </div>
            
            <button 
              onClick={handleBypassClick}
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
                  <h2 className="text-2xl font-arcade font-bold text-arcade-accent tracking-tight">CHEAT LIST</h2>
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
                      crossOrigin="anonymous"
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-6 w-full max-w-[80%]">
                <div className="w-12 h-12 border-t-4 border-white rounded-full animate-spin opacity-60" />
                <p className="text-[7px] md:text-[9px] font-arcade tracking-[0.2em] text-white uppercase text-center leading-loose">
                  {loadingMsg}
                </p>
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
                      {currentScene?.isEnding ? (galleryIndex === 0 ? 'LEVEL COMPLETE' : 'DRINK STATS') : ''}
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
              {galleryIndex === 1 && (
                <div className="mb-10 flex flex-col items-center animate-fade-in">
                  <button 
                    onClick={handleShare}
                    disabled={isSharing}
                    className="group flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                      {isSharing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : shareSuccess ? (
                        <CheckCircle2 className="w-5 h-5 text-arcade-secondary" />
                      ) : (
                        <Instagram className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                      )}
                    </div>
                    <span className="text-[8px] font-arcade text-zinc-500 uppercase tracking-[0.2em] group-hover:text-zinc-300 transition-colors">
                      {isSharing ? 'Capturing...' : shareSuccess ? 'Shared!' : 'Share to Story'}
                    </span>
                  </button>
                </div>
              )}

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

      {/* Hidden Share Card for Screenshot */}
      {currentScene?.isEnding && (
        <div className="fixed left-[-9999px] top-0 pointer-events-none">
          <div 
            ref={shareCardRef}
            style={{ width: '1080px', height: '1920px', boxSizing: 'border-box' }}
            className="bg-[#080c14] p-20 flex flex-col items-center justify-between text-white font-arcade overflow-hidden"
          >
            <div className="w-full flex flex-col items-center gap-10 flex-shrink-0">
              <h1 className="text-6xl font-bold tracking-[0.2em] text-arcade-accent">BANGKOK QUEST</h1>
              <div className="w-full h-2 bg-arcade-accent/20 rounded-full" />
            </div>

            <div className="w-full flex flex-col items-center gap-16 flex-grow justify-center">
              <div className="w-[920px] aspect-[16/9] rounded-[40px] overflow-hidden border-8 border-white/10 shadow-2xl flex-shrink-0 relative">
                <img 
                  src={gameState.currentImageUrls[1] || DEFAULT_IMAGE} 
                  alt="Spirit Drink" 
                  className="absolute inset-0 w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              
              <div className="text-center space-y-8 flex-shrink-0">
                <span className="text-3xl text-arcade-secondary uppercase tracking-[0.5em]">I ended up with</span>
                <h2 className="text-8xl font-bold tracking-tight leading-tight">{currentScene.title}</h2>
              </div>

              <div className="w-full flex flex-col items-center gap-10 bg-white/5 p-16 rounded-[60px] border border-white/10 flex-shrink-0">
                <div className="text-center max-w-[900px]">
                  <p className="text-3xl text-zinc-500 uppercase tracking-[0.3em] mb-6">Stats</p>
                  <p className="text-4xl text-white leading-relaxed tracking-wide font-medium">
                    {currentScene.recipe}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-10 flex-shrink-0 pb-10">
              <div className="w-full h-2 bg-arcade-accent/20 rounded-full" />
              <div className="text-xl font-bold text-arcade-accent tracking-[0.4em] opacity-80">
                Bangkok Quest at Lebua
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Preview Modal for Mobile Fallback */}
      {shareImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
          <div className="w-full max-w-sm flex flex-col items-center gap-6 my-auto relative">
            {/* Top Close Button */}
            <button 
              onClick={() => setShareImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full aspect-[9/16] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
              <img 
                src={shareImage} 
                alt="Share Preview" 
                className="w-full h-full object-contain" 
                onContextMenu={(e) => e.stopPropagation()} // Allow native long-press
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-[8px] text-white/60 text-center uppercase tracking-widest">Hold image to save to photos</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-white font-arcade text-[10px] uppercase tracking-widest animate-pulse">Ready to Share</p>
              <p className="text-zinc-500 text-[8px] uppercase tracking-widest">Tap "Save to Device" or hold the photo</p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={downloadShareImage}
                className="w-full py-4 bg-white text-black font-arcade text-[10px] rounded-xl uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <Download className="w-4 h-4" /> Save to Device
              </button>
              <button 
                onClick={() => setShareImage(null)}
                className="w-full py-4 bg-zinc-800 text-white font-arcade text-[10px] rounded-xl uppercase tracking-[0.2em] hover:bg-zinc-700 transition-all flex items-center justify-center gap-3"
              >
                Back to Result
              </button>
            </div>
          </div>
        </div>
      )}

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
                <h2 className="text-2xl font-arcade font-bold text-arcade-accent tracking-tight">CHEAT LIST</h2>
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
