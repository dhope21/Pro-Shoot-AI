import React, { useState } from 'react';
import { Download, Maximize2, ArrowRightLeft, RefreshCw } from 'lucide-react';
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
  const [showOriginal, setShowOriginal] = useState(false);

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
    <div className="relative group h-full min-h-[500px] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
      
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
      <div className="w-full h-full flex items-center justify-center bg-zinc-950 relative">
        {generatedImage && !showOriginal ? (
            <img 
              src={generatedImage} 
              alt="Generated AI Result" 
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
        ) : originalImage ? (
            <img 
              src={originalImage} 
              alt="Original Upload" 
              className={`max-w-full max-h-full object-contain transition-all duration-300 ${isGenerating ? 'blur-sm scale-95' : ''}`}
            />
        ) : null}
      </div>

      {/* Controls Overlay */}
      {generatedImage && !isGenerating && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent flex items-center justify-between">
          <div className="flex gap-3">
             <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm font-medium transition-colors border border-zinc-700"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {showOriginal ? 'Show Result' : 'Show Original'}
            </button>
             <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-sm font-medium transition-colors border border-zinc-700"
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </button>
          </div>
          
          <button
            onClick={() => downloadImage(generatedImage, `proshoot-ai-${Date.now()}.png`)}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;