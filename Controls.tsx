import React from 'react';
import { TreeConfig } from '../types';

interface ControlsProps {
  config: TreeConfig;
  setConfig: React.Dispatch<React.SetStateAction<TreeConfig>>;
}

export const Controls: React.FC<ControlsProps> = ({ config, setConfig }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 md:p-8 flex justify-center items-end pointer-events-none z-10">
      <div className="bg-black/70 backdrop-blur-xl border border-yellow-600/50 p-6 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.2)] pointer-events-auto max-w-2xl w-full flex flex-col gap-4 transition-all duration-300">
        
        <div className="flex items-center justify-between border-b border-yellow-600/30 pb-3 mb-2">
          <h2 className="text-2xl md:text-3xl text-yellow-500 font-display font-bold tracking-wider drop-shadow-md">
            GRAND CHRISTMAS
          </h2>
          <div className="text-yellow-700 text-xs font-serif tracking-widest uppercase">
            Luxury Edition
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Ornaments Color Selector */}
          <div className="space-y-2">
            <label className="text-yellow-100/80 text-sm font-serif uppercase tracking-wider">Ornament Finish</label>
            <div className="flex gap-2">
              {(['gold', 'red', 'silver'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setConfig({ ...config, ornamentColor: color })}
                  className={`flex-1 h-10 rounded-md border transition-all duration-300 flex items-center justify-center
                    ${config.ornamentColor === color 
                      ? 'border-yellow-400 bg-yellow-900/40 text-yellow-200 shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
                      : 'border-yellow-800/30 bg-black/40 text-yellow-700 hover:border-yellow-600/50'
                    }`}
                >
                  <span className="capitalize font-serif">{color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Light Color Selector */}
          <div className="space-y-2">
            <label className="text-yellow-100/80 text-sm font-serif uppercase tracking-wider">Lighting Mood</label>
            <div className="flex gap-2">
                {[
                    { name: 'Warm', value: '#ffaa00' },
                    { name: 'Cool', value: '#afdbf5' },
                    { name: 'Magenta', value: '#ff00ff' }
                ].map((mood) => (
                    <button
                        key={mood.name}
                        onClick={() => setConfig({ ...config, lightColor: mood.value })}
                        className={`flex-1 h-10 rounded-md border transition-all duration-300 flex items-center justify-center
                        ${config.lightColor === mood.value 
                            ? 'border-yellow-400 bg-yellow-900/40 text-yellow-200 shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
                            : 'border-yellow-800/30 bg-black/40 text-yellow-700 hover:border-yellow-600/50'
                        }`}
                    >
                        <span className="font-serif">{mood.name}</span>
                    </button>
                ))}
            </div>
          </div>

        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between pt-2 border-t border-yellow-600/30 mt-2">
          
          <button 
            onClick={() => setConfig(p => ({ ...p, showSnow: !p.showSnow }))}
            className={`px-4 py-2 rounded border font-serif text-sm transition-all
              ${config.showSnow 
                ? 'border-yellow-500 text-yellow-300 bg-yellow-900/20' 
                : 'border-transparent text-yellow-800 hover:text-yellow-500'}`}
          >
            {config.showSnow ? 'Disable Snow' : 'Enable Snow'}
          </button>

          <button 
            onClick={() => setConfig(p => ({ ...p, rotationSpeed: p.rotationSpeed > 0 ? 0 : 0.2 }))}
            className={`px-4 py-2 rounded border font-serif text-sm transition-all
              ${config.rotationSpeed > 0 
                ? 'border-yellow-500 text-yellow-300 bg-yellow-900/20' 
                : 'border-transparent text-yellow-800 hover:text-yellow-500'}`}
          >
            {config.rotationSpeed > 0 ? 'Pause Rotation' : 'Rotate Tree'}
          </button>

        </div>
      </div>
    </div>
  );
};
