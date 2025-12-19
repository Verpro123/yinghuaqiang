
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

  const defaultImages = useMemo(() => Array.from({ length: 18 }, (_, i) => `https://picsum.photos/400/600?random=${i + 300}`), []);
  const displayImages = customImages.length > 0 ? customImages : defaultImages;

  const bgImage = customImages.length > 0 
    ? customImages[0] 
    : "https://images.unsplash.com/photo-1493673272479-a7e6329e9aed?q=80&w=2069&auto=format&fit=crop";

  // 为每张图片生成随机物理属性
  const fallingData = useMemo(() => {
    return displayImages.map((src, i) => {
      return {
        src,
        left: `${Math.random() * 95}%`, // 随机起始水平位置
        duration: `${18 + Math.random() * 22}s`, // 下落时长
        delay: `${-Math.random() * 40}s`, // 随机初始状态
        initRot: `${(Math.random() - 0.5) * 45}deg`, // 初始 Z 轴角度
        rotDrift: `${(Math.random() - 0.5) * 90}deg`, // 最终 Z 轴旋转偏移
        swayMid: `${(Math.random() - 0.5) * 300}px`, // 下落中的左右晃动幅度
        shapeClass: frameShapes[i % frameShapes.length],
        scale: 0.7 + Math.random() * 0.4, // 随机大小
        zIndex: Math.floor(Math.random() * 50)
      };
    });
  }, [displayImages, frameShapes]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#fff0f3] perspective-container">
      {/* 背景层 - 保持朦胧美 */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-[3000ms] scale-110 blur-[50px] opacity-30 animate-[pulse_12s_infinite_alternate]"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-100/50 via-transparent to-white/40" />
      </div>
      
      {/* 物理掉落的照片墙 */}
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
              className={`w-[130px] md:w-[170px] aspect-[3/4] p-2 bg-white/75 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:scale-125 group-hover:!rotate-0 group-hover:z-[200] group-hover:shadow-pink-400/40 group-hover:bg-white overflow-hidden ${item.shapeClass} border border-white/60`}
              style={{ transform: `scale(${item.scale})` }}
            >
              <img 
                src={item.src} 
                alt=""
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-95 group-hover:opacity-100 ${item.shapeClass}`}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 预览模态框 - 置于最顶层 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[2000] bg-black/5 backdrop-blur-3xl flex items-center justify-center p-8 cursor-zoom-out animate-in fade-in duration-400"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative animate-in zoom-in-90 duration-500 ease-out">
            <img 
              src={selectedImage} 
              className="max-w-[90vw] max-h-[80vh] object-contain border-[16px] border-white shadow-[0_40px_100px_rgba(255,182,193,0.6)] rounded-sm" 
              alt="Memory"
            />
            <button 
                className="absolute -top-8 -right-8 bg-white shadow-2xl text-pink-400 w-14 h-14 rounded-full flex items-center justify-center text-4xl hover:scale-110 transition-transform active:scale-95 font-thin"
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
