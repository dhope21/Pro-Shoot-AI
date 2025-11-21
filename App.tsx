
import React, { useState, useCallback } from 'react';
import { Upload, Wand2, Image as ImageIcon, Info, Trash2, Plus, X, Sparkles } from 'lucide-react';
import OptionSelector from './components/OptionSelector';
import ResultDisplay from './components/ResultDisplay';
import { OutfitStyle, BackgroundType, Expression, GenerationConfig, ImageInput } from './types';
import { generateEditedImage } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';

const App: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<ImageInput[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Changed to string | null to support custom inputs
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [selectedExpression, setSelectedExpression] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [region, setRegion] = useState('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setGeneratedImage(null);

    const newImages: ImageInput[] = [];
    const maxImages = 4;
    const currentCount = uploadedImages.length;

    if (currentCount + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} reference images.`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 6 * 1024 * 1024) {
         setError(`File ${file.name} is too large. Limit is 6MB.`);
         continue;
      }

      try {
        const base64Raw = await fileToBase64(file);
        newImages.push({
          id: Math.random().toString(36).substring(7),
          file,
          base64: base64Raw,
          mimeType: file.type,
          previewUrl: `data:${file.type};base64,${base64Raw}`
        });
      } catch (err) {
        console.error("Error reading file", err);
      }
    }

    if (newImages.length > 0) {
      setUploadedImages(prev => [...prev, ...newImages]);
    }
    
    // Reset input value to allow selecting the same file again if needed
    event.target.value = '';
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleGenerate = useCallback(async () => {
    if (uploadedImages.length === 0) {
      setError('Please upload at least one reference image.');
      return;
    }

    if (!selectedStyle && !selectedBackground && !selectedExpression && !customPrompt.trim() && !region.trim()) {
      setError('Please select at least one option (Style, Expression, Background) or enter a prompt.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const config: GenerationConfig = {
        style: selectedStyle,
        background: selectedBackground,
        expression: selectedExpression,
        customPrompt,
        region,
      };

      const resultUrl = await generateEditedImage(uploadedImages, config);
      setGeneratedImage(resultUrl);
    } catch (err: any) {
      console.error("Generation failed", err);
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [uploadedImages, selectedStyle, selectedBackground, selectedExpression, customPrompt, region]);

  const handleReset = () => {
    setUploadedImages([]);
    setGeneratedImage(null);
    setSelectedStyle(null);
    setSelectedBackground(null);
    setSelectedExpression(null);
    setCustomPrompt('');
    setRegion('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">ProShoot <span className="text-zinc-500 font-normal">AI</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span>Gemini 2.5 Flash Image</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* Left Panel: Controls */}
          <div className="lg:col-span-4 space-y-8 flex flex-col h-full">
            
            {/* Upload Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                  1. Reference Photos <span className="text-zinc-500 text-xs normal-case font-normal">(Max 4)</span>
                </h2>
                {uploadedImages.length > 0 && (
                  <button 
                    onClick={() => setUploadedImages([])}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {uploadedImages.map((img) => (
                   <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-700 group">
                      <img src={img.previewUrl} alt="Ref" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                   </div>
                ))}

                {uploadedImages.length < 4 && (
                  <label className="cursor-pointer aspect-square rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-600 transition-all flex flex-col items-center justify-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                      <Plus className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200" />
                    </div>
                    <span className="text-xs text-zinc-500 font-medium">Add Photo</span>
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      multiple
                    />
                  </label>
                )}
              </div>
              {uploadedImages.length === 0 && (
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Upload a clear photo of the subject. 3-4 photos help preserve identity better.
                  </p>
              )}
            </div>

            {/* Options Section */}
            <div className="space-y-6 pt-6 border-t border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">2. Style & Setting</h2>
              
              <OptionSelector 
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                selectedBackground={selectedBackground}
                setSelectedBackground={setSelectedBackground}
                selectedExpression={selectedExpression}
                setSelectedExpression={setSelectedExpression}
                region={region}
                setRegion={setRegion}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex justify-between">
                  Custom Prompt
                  <span className="text-zinc-600 text-xs normal-case tracking-normal">Optional</span>
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="E.g., 'Add a vintage film grain', 'Remove the person in background', 'Make it cinematic and moody'"
                  className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 mt-auto">
              <button
                onClick={handleGenerate}
                disabled={uploadedImages.length === 0 || isGenerating}
                className={`
                  w-full py-3.5 rounded-xl font-semibold text-white text-sm tracking-wide shadow-xl transition-all flex items-center justify-center gap-2
                  ${uploadedImages.length === 0 || isGenerating
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-zinc-200 shadow-white/10 hover:shadow-white/20 transform hover:-translate-y-0.5 active:translate-y-0'
                  }
                `}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-800 rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Photoshoot
                  </>
                )}
              </button>
              {error && (
                <div className="mt-3 text-xs text-red-300 bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-start gap-2">
                   <Info className="w-4 h-4 shrink-0 mt-0.5" />
                   {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Result */}
          <div className="lg:col-span-8 min-h-[500px]">
            <div className="sticky top-24 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Result</h2>
                 <div className="flex gap-2">
                    <div className="text-[10px] font-medium text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 uppercase">
                        Model: Gemini 2.5 Flash Image
                    </div>
                 </div>
              </div>
              
              <div className="flex-grow">
                <ResultDisplay 
                  originalImage={uploadedImages[0]?.previewUrl || null}
                  generatedImage={generatedImage}
                  isGenerating={isGenerating}
                  onReset={handleReset}
                />
              </div>

              <p className="mt-4 text-xs text-zinc-500 text-center max-w-lg mx-auto">
                Tip: For the most realistic results, upload photos with good lighting. The 'Region' filter helps the AI create culturally accurate backgrounds.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
