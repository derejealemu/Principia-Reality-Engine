
import React, { useState, useEffect } from 'react';
import { AppState, VisualizationData, VisualizationControl, ViewSettings } from '../types';
import { Search, Info, Wand2, History, Sliders, Sparkles, Eye, RotateCcw, Atom, PanelLeftClose, PanelLeftOpen, Share2, Check } from 'lucide-react';

interface ControlPanelProps {
  state: AppState;
  onGenerate: (topic: string) => void;
  currentTitle?: string;
  currentExplanation?: string;
  controls?: VisualizationControl[];
  currentParams?: Record<string, number | boolean>;
  onParamChange?: (id: string, value: number | boolean) => void;
  history: VisualizationData[];
  onSelectHistory: (item: VisualizationData) => void;
  viewSettings: ViewSettings;
  onViewSettingsChange: (settings: ViewSettings) => void;
  onHome: () => void;
  onShare: () => void;
}

const CONCEPT_CATEGORIES = {
  "Cosmos": [
    "Schwarzschild Event Horizon",
    "Relativistic Geodesics", 
    "Holographic Principle",
    "Gravitational Lensing"
  ],
  "Quantum": [
    "Quantum Entanglement",
    "Wavefunction Collapse", 
    "Bose-Einstein Condensate",
    "Quantum Foam",
    "Double Slit Interference",
    "Superstring Vibrations"
  ],
  "Chaos & Math": [
    "Mandelbulb Fractal",
    "Lorenz Attractor",
    "Calabi-Yau Manifolds", 
    "Penrose Quasicrystals",
    "Klein Bottle Topology",
    "4D Hypercube Tesseract"
  ]
};

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  state, 
  onGenerate, 
  currentTitle, 
  currentExplanation, 
  controls,
  currentParams,
  onParamChange,
  history,
  onSelectHistory,
  viewSettings,
  onViewSettingsChange,
  onHome,
  onShare
}) => {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'controls' | 'view'>('info');
  const [isUIHidden, setIsUIHidden] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Auto-switch to controls tab if controls exist when a new viz loads
  useEffect(() => {
    if (controls && controls.length > 0) {
      setActiveTab('controls');
    } else {
      setActiveTab('info');
    }
  }, [controls]);

  // Auto-expand and reset when returning to Home (IDLE state with no title)
  useEffect(() => {
    if (state === AppState.IDLE && !currentTitle) {
      setIsExpanded(true);
      setActiveTab('info');
      setInput('');
    }
  }, [state, currentTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input);
      setIsExpanded(false);
      setActiveTab('info');
    }
  };

  const handleHistorySelect = (item: VisualizationData) => {
    onSelectHistory(item);
    setIsExpanded(false);
    setActiveTab('info');
  };

  const handleExampleClick = (concept: string) => {
    setInput(concept);
    onGenerate(concept);
    setIsExpanded(false);
  };

  const updateZoom = (val: number) => {
    onViewSettingsChange({ ...viewSettings, zoom: val });
  };

  const toggleAutoRotate = () => {
    onViewSettingsChange({ ...viewSettings, autoRotate: !viewSettings.autoRotate });
  };

  const resetView = () => {
    onViewSettingsChange({ zoom: 12, autoRotate: false });
  };

  const handleShareClick = () => {
    onShare();
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Minimized Floating Button
  if (isUIHidden) {
    return (
      <button 
        onClick={() => setIsUIHidden(false)}
        className="absolute top-4 left-4 z-50 p-3 bg-cosmos-800/90 backdrop-blur-md border border-cosmos-500/50 rounded-xl text-neon-blue hover:text-white hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all"
        title="Show Controls"
      >
        <PanelLeftOpen size={24} />
      </button>
    );
  }

  return (
    <div className="absolute top-0 left-0 z-40 p-4 w-full md:w-[400px] max-h-screen overflow-y-auto pointer-events-none custom-scrollbar">
      <div className="pointer-events-auto bg-cosmos-900/90 backdrop-blur-md border border-cosmos-500/50 rounded-2xl shadow-2xl shadow-neon-blue/10 overflow-hidden transition-all duration-500 ease-out">
        
        {/* Header / Search Area */}
        <div className="p-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={onHome}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
              title="Return to Home"
            >
                <div className="p-1.5 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg group-hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-shadow">
                    <Atom size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cosmos-300 tracking-tighter">
                PRINCIPIA
                </h1>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex space-x-1 bg-cosmos-950/50 p-1 rounded-lg border border-cosmos-500/20">
                {controls && controls.length > 0 && (
                  <button 
                    onClick={() => { setActiveTab('controls'); setIsExpanded(true); }}
                    className={`p-1.5 rounded-md transition-colors ${activeTab === 'controls' && isExpanded ? 'bg-cosmos-700 text-neon-blue' : 'text-cosmos-300 hover:text-white'}`}
                    title="Simulation Controls"
                  >
                    <Sliders size={16} />
                  </button>
                )}
                <button 
                  onClick={() => { setActiveTab('view'); setIsExpanded(true); }}
                  className={`p-1.5 rounded-md transition-colors ${activeTab === 'view' && isExpanded ? 'bg-cosmos-700 text-neon-blue' : 'text-cosmos-300 hover:text-white'}`}
                  title="View Settings"
                >
                  <Eye size={16} />
                </button>
                <button 
                  onClick={() => { setActiveTab('history'); setIsExpanded(true); }}
                  className={`p-1.5 rounded-md transition-colors ${activeTab === 'history' && isExpanded ? 'bg-cosmos-700 text-neon-blue' : 'text-cosmos-300 hover:text-white'}`}
                  title="History"
                >
                  <History size={16} />
                </button>
                <button 
                  onClick={() => { setActiveTab('info'); setIsExpanded(!isExpanded && currentTitle ? true : !isExpanded); }}
                  className={`p-1.5 rounded-md transition-colors ${activeTab === 'info' && isExpanded ? 'bg-cosmos-700 text-white' : 'text-cosmos-300 hover:text-white'}`}
                  title="Information"
                >
                  <Info size={16} />
                </button>
              </div>
              
              <button
                 onClick={() => setIsUIHidden(true)}
                 className="p-1.5 text-cosmos-400 hover:text-white transition-colors"
                 title="Hide UI (Theater Mode)"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative group z-10 mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe a concept..."
              className="w-full bg-cosmos-950/80 border border-cosmos-500/50 text-white rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all placeholder-cosmos-500 shadow-inner text-sm"
              disabled={state === AppState.GENERATING}
            />
            <Search className="absolute left-3 top-3 text-cosmos-500 group-focus-within:text-neon-blue transition-colors" size={16} />
            <button 
              type="submit"
              disabled={state === AppState.GENERATING || !input.trim()}
              className="absolute right-2 top-2 p-1 bg-cosmos-700 hover:bg-neon-blue text-white rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-cosmos-700"
            >
              <Wand2 size={14} />
            </button>
          </form>
          
          {/* Toolbar for Share / Actions */}
          {currentTitle && (
            <div className="flex justify-end mb-2">
               <button 
                 onClick={handleShareClick}
                 className="flex items-center gap-1 text-[10px] text-neon-blue hover:text-white transition-colors px-2 py-1 rounded bg-cosmos-800/50 border border-cosmos-500/20"
               >
                 {showCopied ? <Check size={10} /> : <Share2 size={10} />}
                 {showCopied ? 'COPIED' : 'SHARE'}
               </button>
            </div>
          )}
          
          {/* Example Suggestions (Only show when IDLE and expanded) */}
          {state === AppState.IDLE && isExpanded && !currentTitle && (
             <div className="mt-4 border-t border-cosmos-500/30 pt-3">
               <p className="text-[10px] text-cosmos-400 mb-3 font-semibold uppercase tracking-wider flex items-center gap-2">
                 <Sparkles size={10} className="text-neon-purple"/> Mind-Melters
               </p>
               
               <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
                 {Object.entries(CONCEPT_CATEGORIES).map(([category, items]) => (
                   <div key={category}>
                     <h3 className="text-[10px] text-cosmos-500 font-mono uppercase mb-2 pl-1">{category}</h3>
                     <div className="grid grid-cols-2 gap-2">
                       {items.map((concept) => (
                         <button
                           key={concept}
                           onClick={() => handleExampleClick(concept)}
                           className="text-xs text-left bg-cosmos-800/30 hover:bg-neon-blue/10 hover:text-neon-blue border border-cosmos-500/30 hover:border-neon-blue/50 text-cosmos-100 px-3 py-2 rounded-lg transition-all duration-300 group flex items-center justify-between"
                         >
                           <span className="truncate">{concept}</span>
                           <Wand2 size={10} className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-neon-purple shrink-0"/>
                         </button>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </div>

        {/* Content Area */}
        <div className={`border-t border-cosmos-500/30 bg-cosmos-950/30 transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'}`}>
           
           {/* Tab: Info */}
           {activeTab === 'info' && (
             <div className="p-6 pt-4 overflow-y-auto h-full max-h-[60vh] custom-scrollbar">
                {state === AppState.GENERATING ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-cosmos-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-cosmos-700 rounded w-1/2 animate-pulse"></div>
                    <div className="h-32 bg-cosmos-700/50 rounded w-full animate-pulse mt-4"></div>
                  </div>
                ) : currentTitle ? (
                  <>
                    <h2 className="text-lg font-bold text-white mb-2">{currentTitle}</h2>
                    <p className="text-cosmos-100 leading-relaxed text-sm font-light whitespace-pre-wrap">
                      {currentExplanation}
                    </p>
                  </>
                ) : (
                  <div className="text-center text-cosmos-300 py-8 text-sm">
                    <p>Select a topic to derive visual proofs.</p>
                  </div>
                )}
             </div>
           )}

           {/* Tab: View Settings */}
           {activeTab === 'view' && (
             <div className="p-6 pt-4 overflow-y-auto h-full max-h-[60vh] custom-scrollbar">
               <div className="space-y-6">
                 
                 {/* Zoom Control */}
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-neon-blue flex items-center gap-2">
                        <Eye size={14}/> Camera Distance
                      </label>
                      <span className="text-xs font-mono text-cosmos-300">{viewSettings.zoom.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      step={0.5}
                      value={viewSettings.zoom}
                      onChange={(e) => updateZoom(parseFloat(e.target.value))}
                      className="w-full h-2 bg-cosmos-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                    />
                    <div className="flex justify-between text-[10px] text-cosmos-500 px-1">
                      <span>Close</span>
                      <span>Far</span>
                    </div>
                 </div>

                 {/* Auto Rotate */}
                 <div className="flex justify-between items-center p-3 bg-cosmos-800/30 rounded-lg border border-cosmos-500/20">
                   <label className="text-sm font-medium text-cosmos-100 flex items-center gap-2">
                     <RotateCcw size={14} className={viewSettings.autoRotate ? "animate-spin" : ""} style={{animationDuration: "3s"}}/> 
                     Auto Rotate
                   </label>
                   <button 
                     onClick={toggleAutoRotate}
                     className={`w-12 h-6 rounded-full transition-colors relative ${viewSettings.autoRotate ? 'bg-neon-purple' : 'bg-cosmos-600'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${viewSettings.autoRotate ? 'left-7' : 'left-1'}`}></div>
                   </button>
                 </div>

                 {/* Reset */}
                 <button 
                   onClick={resetView}
                   className="w-full py-2 rounded-lg border border-cosmos-500/50 hover:bg-cosmos-700 text-cosmos-300 hover:text-white text-xs transition-colors flex items-center justify-center gap-2"
                 >
                   Reset View
                 </button>

               </div>
             </div>
           )}

           {/* Tab: Controls */}
           {activeTab === 'controls' && (
             <div className="p-6 pt-4 overflow-y-auto h-full max-h-[60vh] custom-scrollbar">
               {controls && controls.length > 0 && currentParams ? (
                 <div className="space-y-6">
                    {controls.map((control) => (
                      <div key={control.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-neon-blue">{control.label}</label>
                          <span className="text-xs font-mono text-cosmos-300">
                            {typeof currentParams[control.id] === 'number' 
                              ? (currentParams[control.id] as number).toFixed(2) 
                              : currentParams[control.id]}
                          </span>
                        </div>
                        {control.type === 'range' && (
                          <input
                            type="range"
                            min={control.min}
                            max={control.max}
                            step={control.step}
                            value={currentParams[control.id] as number}
                            onChange={(e) => onParamChange && onParamChange(control.id, parseFloat(e.target.value))}
                            className="w-full h-2 bg-cosmos-700 rounded-lg appearance-none cursor-pointer accent-neon-purple"
                          />
                        )}
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="text-center text-cosmos-500 py-8 text-sm">
                   No interactive controls for this visualization.
                 </div>
               )}
             </div>
           )}

           {/* Tab: History */}
           {activeTab === 'history' && (
              <div className="p-2 overflow-y-auto h-full max-h-[60vh] custom-scrollbar">
                {history.length === 0 ? (
                  <div className="text-center text-cosmos-500 py-8 text-sm">
                    No visualizations generated yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistorySelect(item)}
                        className="w-full text-left p-3 rounded-lg hover:bg-cosmos-700/50 transition-colors group border border-transparent hover:border-cosmos-500/30"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-sm text-cosmos-100 group-hover:text-neon-blue transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-cosmos-500 flex items-center gap-1">
                            {/* <Clock size={10} /> */}
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-cosmos-400 mt-1 truncate">
                          {item.description}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
           )}
        </div>
      </div>
      
      {/* Hint when collapsed but NOT hidden */}
      {!isExpanded && currentTitle && (
         <div className="pointer-events-auto mt-2 flex gap-2">
            <button 
              onClick={() => { setActiveTab('info'); setIsExpanded(true); }}
              className="bg-cosmos-900/80 backdrop-blur text-xs text-neon-blue px-4 py-2 rounded-full border border-cosmos-500/50 hover:bg-cosmos-700 transition-all shadow-lg"
            >
              Show Info
            </button>
            <button 
              onClick={() => { setActiveTab('view'); setIsExpanded(true); }}
              className="bg-cosmos-900/80 backdrop-blur text-xs text-white px-4 py-2 rounded-full border border-cosmos-500/50 hover:bg-cosmos-700 transition-all flex items-center gap-2 shadow-lg"
            >
              <Eye size={12}/> View
            </button>
            {controls && controls.length > 0 && (
              <button 
                onClick={() => { setActiveTab('controls'); setIsExpanded(true); }}
                className="bg-cosmos-900/80 backdrop-blur text-xs text-neon-purple px-4 py-2 rounded-full border border-cosmos-500/50 hover:bg-cosmos-700 transition-all flex items-center gap-2 shadow-lg"
              >
                <Sliders size={12}/> Controls
              </button>
            )}
         </div>
      )}
    </div>
  );
};
