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
    // FIXED: Passing sceneId ensures we get the specific mapped image for this scene
    const imagePromise = generateSceneImage(sceneId).catch(err => {
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

  const*
