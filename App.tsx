import React, { useState, Suspense, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Scene } from './components/Scene';
import { TreeConfig } from './types';

// Default images for the tree
const INITIAL_IMAGES = [
  'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1576919228236-a097c32a58be?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1482638202372-7848b6b08d29?auto=format&fit=crop&w=600&q=80', // Replaced image
  'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=600&q=80', // Festive mood
];

function App() {
  const [config, setConfig] = useState<TreeConfig>({
    rotationSpeed: 0.2,
    lightColor: '#ffaa00',
    showSnow: true,
    ornamentColor: 'gold',
  });

  const [images, setImages] = useState<string[]>(INITIAL_IMAGES);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cycleConfig = useCallback(() => {
    setConfig(prev => {
      const colors: ('gold' | 'red' | 'silver')[] = ['gold', 'red', 'silver'];
      const nextColorIndex = (colors.indexOf(prev.ornamentColor) + 1) % colors.length;
      return {
        ...prev,
        ornamentColor: colors[nextColorIndex]
      };
    });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file as Blob));
      // Prepend new images so they appear first/more prominently if logic allows, 
      // or replace entirely. Let's append to mix them in.
      setImages(prev => [...newImages, ...prev]);
    }
  };

  const triggerFileUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden cursor-pointer" title="Click tree to change style, click photos to view">
      {/* Background Gradient Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#1a1f1a_0%,_#000000_80%)] z-0" />

      {/* Decorative Text */}
      <div className="absolute top-10 left-0 right-0 text-center pointer-events-none z-10 select-none flex flex-col items-center justify-center">
        <h1 className="font-display text-3xl md:text-5xl text-yellow-500 font-bold tracking-[0.2em] drop-shadow-[0_4px_15px_rgba(255,215,0,0.5)]">
            YLH MERRY CHRISTMAS
        </h1>
      </div>

      {/* Upload Button */}
      <div className="absolute top-6 right-6 z-20">
        <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
        />
        <button 
            onClick={triggerFileUpload}
            className="bg-black/40 backdrop-blur-md border border-yellow-600/50 text-yellow-500 font-serif px-4 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-yellow-900/40 transition-all shadow-[0_0_15px_rgba(255,215,0,0.1)]"
        >
            Upload Memories
        </button>
      </div>

      <Canvas shadows dpr={[1, 2]} className="z-0" onClick={cycleConfig}>
        <Suspense fallback={null}>
            <Scene config={config} onImageClick={setSelectedImage} images={images} />
        </Suspense>
      </Canvas>
      
      {/* Image Modal Overlay */}
      {selectedImage && (
        <div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10 transition-all duration-500"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
        >
            <div className="relative max-w-4xl max-h-[80vh] border-2 border-yellow-600/30 p-2 bg-black shadow-[0_0_50px_rgba(255,215,0,0.2)] transform scale-100 animate-in fade-in zoom-in duration-300">
                <img 
                    src={selectedImage} 
                    alt="Memory" 
                    className="max-w-full max-h-[75vh] object-contain block" 
                />
                <button 
                    className="absolute -top-12 right-0 text-white font-serif text-sm hover:text-yellow-500 tracking-widest"
                    onClick={() => setSelectedImage(null)}
                >
                    CLOSE
                </button>
            </div>
        </div>
      )}

      <Loader 
        containerStyles={{ background: 'radial-gradient(circle, #05140d 0%, #000 100%)' }}
        innerStyles={{ width: '50vw', height: '2px', background: '#333' }}
        barStyles={{ background: '#ffd700', height: '2px' }}
        dataStyles={{ color: '#ffd700', fontFamily: 'serif', fontSize: '1.2rem' }}
      />
    </div>
  );
}

export default App;