import React, { useState, useEffect, useCallback } from 'react';
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

    // Random loading message
    setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    
    setGameState(prev => ({ 
      ...prev, 
      isGenerating: true,
      currentSceneId: sceneId 
    }));

    try {
      // 1. Get Text
      const textPromise = generateSceneContent(scene.corePrompt).catch(err => {
        console.error("Text Gen Error:", err);
        return scene.corePrompt;
      });

      // 2. Get Image - CRITICAL: We pass 'sceneId' here (e.g., 'start', '2A')
      const imagePromise = generateSceneImage(sceneId).catch(err => {
        console.error("Image Gen Error:", err);
        return DEFAULT_IMAGE;
      });

      // Wait for both
      let [narration, imageUrl] = await Promise.all([textPromise, imagePromise]);

      // Fallback if image is undefined
      if (!imageUrl) imageUrl = DEFAULT_IMAGE;

      setGameState(prev => ({
        ...prev,
        currentText: narration,
        currentImageUrl: imageUrl,
        isGenerating: false,
        history: [...prev.history, sceneId]
      }));

    } catch (error) {
      console.error("Scene Load Error:", error);
      setGameState(prev => ({
        ...prev,
        isGenerating: false,
        currentText: "The city lights flicker... something went wrong. Try refreshing.",
        currentImageUrl: DEFAULT_IMAGE
      }));
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadScene('start');
  }, [loadScene]);

  const handleChoice = (nextId: string) => {
    if (gameState.isGenerating) return*
