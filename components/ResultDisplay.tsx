
import React, { useState } from 'react';
import { Download, Maximize2, RefreshCw, Check } from 'lucide-react';
import { downloadImage } from '../utils/imageUtils';

interface ResultDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  isGenerating: boolean;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  originalImage, 
  generatedImage, 
  isGenerating,
  onReset 
}) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = () => {
    if (generatedImage) {
      downloadImage(generatedImage, `proshoot-ai-${Date.now()}.png`);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
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
      <div className="relative group flex-grow min-h-[400px] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
        
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
        <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-medium transition-colors border border-zinc-700 active:bg-zinc-600"
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </button>
          
          <button
            onClick={handleDownload}
            disabled={isDownloaded}
            className={`
                flex-[2] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all transform active:scale-95
                ${isDownloaded 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 cursor-default' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 hover:-translate-y-0.5'
                }
            `}
          >
            {isDownloaded ? (
                <>
                    <Check className="w-4 h-4" />
                    Saved to Device
                </>
            ) : (
                <>
                    <Download className="w-4 h-4" />
                    Download Result
                </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
