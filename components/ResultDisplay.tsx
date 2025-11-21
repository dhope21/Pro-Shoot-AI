
import React, { useState } from 'react';
import { Download, Maximize2, RefreshCw, Check, Wand2, X, Sparkles } from 'lucide-react';
import { downloadImage } from '../utils/imageUtils';

interface ResultDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
  onReset: () => void;
  onRefine: (prompt: string) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  originalImage, 
  generatedImage, 
  isGenerating,
  onReset,
  onRefine
}) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');

  const handleDownload = () => {
    if (generatedImage) {
      downloadImage(generatedImage, `proshoot-ai-${Date.now()}.png`);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
    }
  };

  const handleSubmitRefinement = () => {
    if (refinePrompt.trim()) {
        onRefine(refinePrompt);
        setIsRefining(false);
        setRefinePrompt('');
    }
  };

  if (!originalImage && !generatedImage && !isGenerating) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
        <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
          <Maximize2 className="w-6 h-6 opacity-50" />
        </div>
        <p className="text-lg font-medium">Ready to Create</p>
        <p className="text-sm opacity-70">Upload an image to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      
      {/* Image Container */}
      <div className="relative group flex-grow min-h-[400px] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-500">
        
        {/* Loading State Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-indigo-400 font-medium animate-pulse text-lg">Creating Magic...</p>
            <p className="text-zinc-500 text-sm mt-2">This may take a few seconds</p>
          </div>
        )}

        {/* Main Image Display */}
        <div className="w-full h-full flex items-center justify-center bg-zinc-950 relative p-2">
          {generatedImage ? (
              <img 
                src={generatedImage} 
                alt="Generated AI Result" 
                className="max-w-full max-h-full object-contain shadow-xl"
              />
          ) : originalImage ? (
              <img 
                src={originalImage} 
                alt="Original Upload" 
                className={`max-w-full max-h-full object-contain transition-all duration-300 ${isGenerating ? 'blur-sm scale-95' : ''}`}
              />
          ) : null}
        </div>
      </div>

      {/* Controls - Below Image */}
      {generatedImage && !isGenerating && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Normal Mode Buttons */}
            {!isRefining ? (
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                    onClick={onReset}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-medium transition-colors border border-zinc-700 active:bg-zinc-600"
                    >
                    <RefreshCw className="w-4 h-4" />
                    Start Over
                    </button>

                    <button
                    onClick={() => setIsRefining(true)}
                    className="flex-[1.5] flex items-center justify-center gap-2 px-4 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-white/5"
                    >
                    <Wand2 className="w-4 h-4" />
                    Iterate / Fix
                    </button>
                
                    <button
                    onClick={handleDownload}
                    disabled={isDownloaded}
                    className={`
                        flex-[1.5] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all transform active:scale-95
                        ${isDownloaded 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 cursor-default' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 hover:-translate-y-0.5'
                        }
                    `}
                    >
                    {isDownloaded ? (
                        <>
                            <Check className="w-4 h-4" />
                            Saved
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Download
                        </>
                    )}
                    </button>
                </div>
            ) : (
                // Refine Mode UI
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            Refine Result
                        </h3>
                        <button onClick={() => setIsRefining(false)} className="text-zinc-500 hover:text-zinc-300">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <textarea 
                        value={refinePrompt}
                        onChange={(e) => setRefinePrompt(e.target.value)}
                        placeholder="What minor adjustment do you need? (e.g. 'Make the lighting warmer', 'Fix the tie', 'Make the smile bigger')"
                        className="w-full h-20 bg-black/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                        autoFocus
                    />
                    <div className="flex gap-2">
                         <button 
                            onClick={() => setIsRefining(false)}
                            className="flex-1 px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmitRefinement}
                            disabled={!refinePrompt.trim()}
                            className="flex-[2] px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Wand2 className="w-3 h-3" />
                            Generate Adjustment
                        </button>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
