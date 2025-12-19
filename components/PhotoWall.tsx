
import React, { useState, useMemo } from 'react';

interface PhotoWallProps {
  customImages?: string[];
}

const PhotoWall: React.FC<PhotoWallProps> = ({ customImages = [] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const frameShapes = useMemo(() => [
    "rounded-2xl",
    "rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%]",
    "rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]",
    "rounded-[50%_50%_20%_80%_/_20%_20%_80%_80%]",
    "rounded-full",
    "rounded-[40%_60%_60%_40%_/_70%_30%_30%_70%]",
    "rounded-[70%_30%_30%_70%_/_60%_40%_60%_40%]",
  ], []);

  // Curated high-end IDs from Unsplash (People, Architecture, Technology)
  const premiumUnsplashIds = [
    'photo-1534528741775-53994a69daeb', // People - High-end Portrait
    'photo-1486406146926-c627a92ad1ab', // Architecture - Modern Office
    'photo-1485827404703-89b55fcc595e', // Tech - Humanoid Robot
    'photo-1531746020798-e6953c6e8e04', // People - Stylized Portrait
    'photo-1511818966892-d7d671e672a2', // Architecture - Minimalist Interior
    'photo-1451187580459-43490279c0fa', // Tech - Digital Earth
    'photo-1506794778202-cad84cf45f1d', // People - Male Portrait
    'photo-1485081666477-b3a1e8a49a9f', // Architecture - Brutalist
    'photo-1518770660439-4636190af475', // Tech - Processor
    'photo-1507003211169-0a1dd7228f2d', // People - Expression
    'photo-1503387762-592dea58ef23', // Architecture - Spiral Stairs
    'photo-1550751827-4bd374c3f58b', // Tech - Matrix/Code
    'photo-1539571696357-5a69c17a67c6', // People - Street Style
    'photo-1487958449943-2429e8be8625', // Architecture - Modern Museum
    'photo-1581091226825-a6a2a5aee158', // Tech - Engineering
    'photo-1517841905240-472988babdf9', // People - Group Portrait
    'photo-1449156001437-342eaf64508d', // Architecture - Urban Geometric
    'photo-1461749280684-dccba630e2f6', // Tech - Programming
  ];

  const defaultImages = useMemo(() => 
    premiumUnsplashIds.map(id => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=800&h=1200`),
  []);
  
  const displayImages = customImages.length > 0 ? customImages : defaultImages;

  const bgImage = customImages.length > 0 
    ? customImages[0] 
    : "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

  // Generate physics data for falling photos
  const fallingData = useMemo(() => {
    return displayImages.map((src, i) => {
      return {
        src,
        left: `${Math.random() * 95}%`,
        duration: `${22 + Math.random() * 15}s`, // Slightly slower for more "weight"
        delay: `${-Math.random() * 40}s`,
        initRot: `${(Math.random() - 0.5) * 60}deg`,
        rotDrift: `${(Math.random() - 0.5) * 120}deg`,
        swayMid: `${(Math.random() - 0.5) * 400}px`,
        shapeClass: frameShapes[i % frameShapes.length],
        scale: 0.8 + Math.random() * 0.3,
        zIndex: Math.floor(Math.random() * 50)
      };
    });
  }, [displayImages, frameShapes]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#fff0f3] perspective-container">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-[3000ms] scale-110 blur-[60px] opacity-25 animate-[pulse_15s_infinite_alternate]"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-100/40 via-transparent to-white/30" />
      </div>
      
      {/* Falling Photos Wall */}
      <div className="relative z-10 w-full h-full">
        {fallingData.map((item, idx) => (
          <div 
            key={idx} 
            className="photo-falling-item group cursor-zoom-in"
            onClick={() => setSelectedImage(item.src)}
            style={{ 
              left: item.left,
              zIndex: item.zIndex,
              '--duration': item.duration,
              '--delay': item.delay,
              '--init-rot': item.initRot,
              '--rot-drift': item.rotDrift,
              '--sway-mid': item.swayMid,
            } as React.CSSProperties}
          >
            <div 
              className={`w-[140px] md:w-[190px] aspect-[3/4] p-2 bg-white/80 backdrop-blur-lg shadow-[0_20px_45px_rgba(0,0,0,0.12)] transition-all duration-700 group-hover:scale-125 group-hover:!rotate-0 group-hover:z-[200] group-hover:shadow-pink-300/50 group-hover:bg-white overflow-hidden ${item.shapeClass} border border-white/80`}
              style={{ transform: `scale(${item.scale})` }}
            >
              <img 
                src={item.src} 
                alt=""
                className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100 ${item.shapeClass}`}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[2000] bg-black/10 backdrop-blur-3xl flex items-center justify-center p-8 cursor-zoom-out animate-in fade-in duration-500"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative animate-in zoom-in-95 duration-700 ease-out">
            <img 
              src={selectedImage} 
              className="max-w-[85vw] max-h-[85vh] object-contain border-[12px] border-white shadow-[0_50px_120px_rgba(0,0,0,0.4)] rounded-sm" 
              alt="High Definition Memory"
            />
            <button 
                className="absolute -top-10 -right-10 bg-white/90 hover:bg-white shadow-2xl text-pink-500 w-16 h-16 rounded-full flex items-center justify-center text-5xl hover:scale-110 transition-all active:scale-95 font-thin"
                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
                ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoWall;
