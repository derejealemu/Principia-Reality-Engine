import React, { useState, useEffect } from 'react';
import { VisualizationData, AppState, ViewSettings, SharedState } from './types';
import { generatePhysicsVisualization } from './services/geminiService';
import { VisualizationCanvas } from './components/VisualizationCanvas';
import { ControlPanel } from './components/ControlPanel';
import { Loader } from './components/Loader';
import { ApiKeyModal } from './components/ApiKeyModal';

const STORAGE_KEY = 'physics_viz_history';
const API_KEY_STORAGE = 'principia_api_key';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [vizData, setVizData] = useState<VisualizationData | null>(null);
  const [currentParams, setCurrentParams] = useState<Record<string, number | boolean>>({});
  const [viewSettings, setViewSettings] = useState<ViewSettings>({ zoom: 12, autoRotate: false, bloomStrength: 0.8, color1: '#00f3ff', color2: '#bc13fe' });
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<VisualizationData[]>([]);
  const [isSharedView, setIsSharedView] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }

      const storedKey = localStorage.getItem(API_KEY_STORAGE);
      if (storedKey) {
        setApiKey(storedKey);
      }

      if (window.location.hash && window.location.hash.length > 1) {
        try {
          const base64Data = window.location.hash.substring(1);
          const jsonString = atob(base64Data);
          const sharedState: SharedState = JSON.parse(jsonString);

          if (sharedState.v) {
            setVizData(sharedState.v);
            setCurrentParams(sharedState.p || {});
            setViewSettings(sharedState.c || { zoom: 12, autoRotate: false, bloomStrength: 0.8, color1: '#00f3ff', color2: '#bc13fe' });
            setState(AppState.VISUALIZING);
            setIsSharedView(true);
          }
        } catch (e) {
          console.error("Failed to parse shared URL", e);
        }
      }

    } catch (e) {
      console.error("Failed to load local storage", e);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem(API_KEY_STORAGE, key);
  };

  const saveToHistory = (newItem: VisualizationData) => {
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const handleHome = () => {
    setVizData(null);
    setState(AppState.IDLE);
    setCurrentParams({});
    setViewSettings({ zoom: 12, autoRotate: false, bloomStrength: 0.8, color1: '#00f3ff', color2: '#bc13fe' });
    setError(null);
    window.history.replaceState(null, '', window.location.pathname);
    setIsSharedView(false);
  };

  const handleGenerate = async (topic: string) => {
    if (!apiKey) return;

    setState(AppState.GENERATING);
    setError(null);

    try {
      const rawData = await generatePhysicsVisualization(topic, apiKey);

      const newData: VisualizationData = {
        ...rawData,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };

      setVizData(newData);

      const initialParams: Record<string, number | boolean> = {};
      if (newData.controls) {
        newData.controls.forEach(c => {
          initialParams[c.id] = c.defaultValue;
        });
      }
      setCurrentParams(initialParams);
      setViewSettings(prev => ({ ...prev, zoom: 12 }));

      saveToHistory(newData);
      setState(AppState.VISUALIZING);
      setIsSharedView(false);
    } catch (err: any) {
      console.error(err);
      let errorMsg = "Failed to visualize the concept. The cosmos is unclear.";

      if (err.message && err.message.includes("API key")) {
        errorMsg = "Invalid API Key. Please check your settings.";
        setApiKey(null);
        localStorage.removeItem(API_KEY_STORAGE);
      } else if (err.status === 429) {
        errorMsg = "Rate limit exceeded. Please wait a moment.";
      }

      setError(errorMsg);
      setState(AppState.ERROR);
    }
  };

  const handleSelectHistory = (item: VisualizationData) => {
    setVizData(item);

    const initialParams: Record<string, number | boolean> = {};
    if (item.controls) {
      item.controls.forEach(c => {
        initialParams[c.id] = c.defaultValue;
      });
    }
    setCurrentParams(initialParams);
    setViewSettings(prev => ({ ...prev, zoom: 12 }));

    setState(AppState.VISUALIZING);
    setError(null);
    setIsSharedView(false);
  };

  const handleParamChange = (id: string, value: number | boolean) => {
    setCurrentParams(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleShare = () => {
    if (!vizData) return;

    const sharedState: SharedState = {
      v: vizData,
      p: currentParams,
      c: viewSettings
    };

    try {
      const jsonString = JSON.stringify(sharedState);
      const base64Data = btoa(jsonString);
      const url = `${window.location.origin}${window.location.pathname}#${base64Data}`;

      navigator.clipboard.writeText(url);
    } catch (e) {
      console.error("Failed to generate share link", e);
    }
  };

  return (
    <div className="relative w-full h-screen bg-cosmos-900 text-white overflow-hidden">

      {!apiKey && !isSharedView && <ApiKeyModal onSave={handleSaveApiKey} />}

      <div className="absolute inset-0 z-0">
        <VisualizationCanvas
          data={vizData}
          params={currentParams}
          viewSettings={viewSettings}
        />
      </div>

      {(apiKey || isSharedView) && (
        <ControlPanel
          state={state}
          onGenerate={handleGenerate}
          currentTitle={vizData?.title}
          currentExplanation={vizData?.explanation}
          controls={vizData?.controls}
          currentParams={currentParams}
          onParamChange={handleParamChange}
          history={history}
          onSelectHistory={handleSelectHistory}
          viewSettings={viewSettings}
          onViewSettingsChange={setViewSettings}
          onHome={handleHome}
          onShare={handleShare}
        />
      )}

      {state === AppState.GENERATING && <Loader />}

      {state === AppState.ERROR && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-red-900/80 border border-red-500 text-white px-6 py-4 rounded-xl backdrop-blur shadow-lg z-50 animate-bounce">
          <p className="font-bold">Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setState(AppState.IDLE)}
            className="mt-2 text-xs underline hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {state === AppState.IDLE && (apiKey || isSharedView) && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10 w-full px-4">
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 select-none tracking-tighter">
            PRINCIPIA
          </div>
          <div className="text-sm md:text-base text-neon-blue/60 mt-6 tracking-[0.6em] font-mono uppercase font-light drop-shadow-[0_0_8px_rgba(0,243,255,0.3)]">
            G-3 Reality Engine
          </div>
        </div>
      )}
    </div>
  );
};

export default App;