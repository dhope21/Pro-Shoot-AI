
import React from 'react';
import { OutfitStyle, BackgroundType, Expression } from '../types';
import { Briefcase, Home, Building2, Camera, Shirt, User, Trees, Zap, Sun, X, MapPin, Smile, Meh, PenTool } from 'lucide-react';

interface OptionSelectorProps {
  selectedStyle: string | null;
  setSelectedStyle: (style: string | null) => void;
  selectedBackground: string | null;
  setSelectedBackground: (bg: string | null) => void;
  selectedExpression: string | null;
  setSelectedExpression: (exp: string | null) => void;
  region: string;
  setRegion: (region: string) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  selectedStyle,
  setSelectedStyle,
  selectedBackground,
  setSelectedBackground,
  selectedExpression,
  setSelectedExpression,
  region,
  setRegion
}) => {
  
  const styles = [
    { id: OutfitStyle.CASUAL, label: 'Casual', icon: <Shirt className="w-4 h-4 shrink-0" /> },
    { id: OutfitStyle.FORMAL, label: 'Formal Suit', icon: <Briefcase className="w-4 h-4 shrink-0" /> },
    { id: OutfitStyle.HOODIE, label: 'Zipper Hoodie', icon: <User className="w-4 h-4 shrink-0" /> },
    { id: OutfitStyle.LEATHER_JACKET, label: 'Leather Jacket', icon: <Camera className="w-4 h-4 shrink-0" /> },
    { id: OutfitStyle.CYBERPUNK, label: 'Cyberpunk Techwear', icon: <Zap className="w-4 h-4 shrink-0" /> },
  ];

  const expressions = [
    { id: Expression.SMILING, label: 'Smiling', icon: <Smile className="w-4 h-4 shrink-0" /> },
    { id: Expression.LAUGHING, label: 'Laughing', icon: <Smile className="w-4 h-4 shrink-0" /> },
    { id: Expression.SERIOUS, label: 'Serious', icon: <User className="w-4 h-4 shrink-0" /> },
    { id: Expression.NEUTRAL, label: 'Neutral', icon: <Meh className="w-4 h-4 shrink-0" /> },
  ];

  const backgrounds = [
    { id: BackgroundType.STUDIO, label: 'Pro Studio', icon: <Camera className="w-4 h-4 shrink-0" /> },
    { id: BackgroundType.OFFICE, label: 'Modern Office', icon: <Building2 className="w-4 h-4 shrink-0" /> },
    { id: BackgroundType.HOME, label: 'Cozy Home', icon: <Home className="w-4 h-4 shrink-0" /> },
    { id: BackgroundType.BALCONY, label: 'Luxury Balcony', icon: <Building2 className="w-4 h-4 shrink-0" /> },
    { id: BackgroundType.OUTDOOR, label: 'Urban Bokeh', icon: <Trees className="w-4 h-4 shrink-0" /> },
    { id: BackgroundType.NEON, label: 'Neon City', icon: <Zap className="w-4 h-4 shrink-0" /> },
  ];

  const isCustomStyle = selectedStyle && !Object.values(OutfitStyle).includes(selectedStyle as OutfitStyle);
  const isCustomExpression = selectedExpression && !Object.values(Expression).includes(selectedExpression as Expression);
  const isCustomBackground = selectedBackground && !Object.values(BackgroundType).includes(selectedBackground as BackgroundType);

  return (
    <div className="space-y-6">
      {/* Region Filter */}
      <div>
         <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 
              Location Context
            </h3>
         </div>
         <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex items-center focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
            <input 
              type="text" 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. New York, Tokyo, Mumbai, Paris (Optional)"
              className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 px-3 py-2 focus:outline-none"
            />
            {region && (
              <button onClick={() => setRegion('')} className="p-2 text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            )}
         </div>
         <p className="text-[10px] text-zinc-500 mt-1.5 ml-1">
           Helps generate more realistic, culturally relevant backgrounds.
         </p>
      </div>

      {/* Styles */}
      <div>
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Outfit Style</h3>
            {selectedStyle && (
                <button onClick={() => setSelectedStyle(null)} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear
                </button>
            )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          {styles.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedStyle(selectedStyle === item.id ? null : item.id)}
              className={`
                flex items-start gap-2 px-3 py-3 rounded-xl border text-xs font-medium transition-all duration-200 h-auto min-h-[3rem]
                ${selectedStyle === item.id 
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800'
                }
              `}
            >
              <span className="mt-0.5">{item.icon}</span>
              <span className="text-left whitespace-normal leading-snug">{item.label}</span>
            </button>
          ))}
        </div>
        
        {/* Custom Style Input */}
        <div className={`
            bg-zinc-900 border rounded-xl p-1 flex items-center transition-all
            ${isCustomStyle ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-zinc-800 focus-within:border-indigo-500'}
        `}>
            <div className="pl-3 text-zinc-500">
                <PenTool className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              value={isCustomStyle ? selectedStyle || '' : ''}
              onChange={(e) => setSelectedStyle(e.target.value)}
              placeholder="Or type your own outfit (e.g. 'Red Prom Dress')..."
              className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 px-3 py-2 focus:outline-none"
            />
        </div>
      </div>

      {/* Expressions */}
      <div>
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Expression</h3>
            {selectedExpression && (
                <button onClick={() => setSelectedExpression(null)} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear
                </button>
            )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          {expressions.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedExpression(selectedExpression === item.id ? null : item.id)}
              className={`
                flex items-start gap-2 px-3 py-3 rounded-xl border text-xs font-medium transition-all duration-200 h-auto min-h-[3rem]
                ${selectedExpression === item.id 
                  ? 'bg-pink-600/20 border-pink-500 text-pink-200 shadow-[0_0_10px_rgba(236,72,153,0.2)]' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800'
                }
              `}
            >
              <span className="mt-0.5">{item.icon}</span>
              <span className="text-left whitespace-normal leading-snug">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Expression Input */}
        <div className={`
            bg-zinc-900 border rounded-xl p-1 flex items-center transition-all
            ${isCustomExpression ? 'border-pink-500 ring-1 ring-pink-500/50' : 'border-zinc-800 focus-within:border-pink-500'}
        `}>
            <div className="pl-3 text-zinc-500">
                <PenTool className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              value={isCustomExpression ? selectedExpression || '' : ''}
              onChange={(e) => setSelectedExpression(e.target.value)}
              placeholder="Or type your own expression (e.g. 'Surprised')..."
              className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 px-3 py-2 focus:outline-none"
            />
        </div>
      </div>

      {/* Backgrounds */}
      <div>
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Background</h3>
            {selectedBackground && (
                <button onClick={() => setSelectedBackground(null)} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear
                </button>
            )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          {backgrounds.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedBackground(selectedBackground === item.id ? null : item.id)}
              className={`
                flex items-start gap-2 px-3 py-3 rounded-xl border text-xs font-medium transition-all duration-200 h-auto min-h-[3rem]
                ${selectedBackground === item.id 
                   ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                   : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800'
                }
              `}
            >
              <span className="mt-0.5">{item.icon}</span>
              <span className="text-left whitespace-normal leading-snug">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Background Input */}
        <div className={`
            bg-zinc-900 border rounded-xl p-1 flex items-center transition-all
            ${isCustomBackground ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-zinc-800 focus-within:border-emerald-500'}
        `}>
            <div className="pl-3 text-zinc-500">
                <PenTool className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              value={isCustomBackground ? selectedBackground || '' : ''}
              onChange={(e) => setSelectedBackground(e.target.value)}
              placeholder="Or type your own background (e.g. 'Space Station')..."
              className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 px-3 py-2 focus:outline-none"
            />
        </div>
      </div>
    </div>
  );
};

export default OptionSelector;
