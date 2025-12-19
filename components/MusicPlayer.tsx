
import React from 'react';
import { Song } from '../types';

interface MusicPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  mode?: 'compact' | 'expanded';
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  mode = 'compact'
}) => {
  const isExpanded = mode === 'expanded';

  return (
    <div className={`flex items-center select-none transition-all duration-700 ${isExpanded ? 'gap-10 flex-1' : 'gap-10 w-full'}`}>
      {/* 唱片展示区 */}
      <div className="relative group shrink-0">
        <div 
          className={`bg-[#0a0a0a] rounded-full relative shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-700 ${isPlaying ? 'vinyl-spin' : ''} ${isExpanded ? 'w-20 h-20' : 'w-28 h-28'}`}
          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
        >
          <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-full opacity-30"></div>
          
          <div className={`bg-white/95 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-2 overflow-hidden shadow-inner border border-gray-100 transition-all duration-700 ${isExpanded ? 'w-12 h-12' : 'w-16 h-16'}`}>
            <div className="text-center">
              <p className="text-[6px] font-black text-rose-600 leading-tight uppercase truncate max-w-[40px]">
                {currentSong.title}
              </p>
            </div>
          </div>
          <div className="w-2 h-2 bg-gray-400 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 border border-gray-600"></div>
        </div>
      </div>

      {/* 歌曲信息与控制区 */}
      <div className={`flex-1 flex transition-all duration-700 ${isExpanded ? 'flex-row items-center justify-between gap-8' : 'flex-col gap-4'}`}>
        <div className={`space-y-1 transition-all ${isExpanded ? 'max-w-[300px]' : ''}`}>
          <h2 className={`text-white font-black truncate tracking-tight drop-shadow-md transition-all duration-700 ${isExpanded ? 'text-base' : 'text-lg'}`}>
            {currentSong.title}
          </h2>
          <div className="inline-block px-2.5 py-0.5 bg-white/10 rounded-full text-pink-200 text-[9px] font-bold border border-white/10 backdrop-blur-sm">
            {currentSong.artist}
          </div>
        </div>

        <div className={`flex items-center transition-all duration-700 ${isExpanded ? 'gap-8 text-xl' : 'gap-6 text-2xl'}`}>
          <button 
            onClick={onPrev} 
            className="text-pink-100/60 hover:text-pink-100 transition-all hover:scale-110 active:scale-90"
            title="Previous"
          >
            ⏮
          </button>
          <button 
            onClick={onTogglePlay} 
            className={`bg-gradient-to-br from-rose-400 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-black/20 hover:scale-110 active:scale-95 transition-all text-xl pl-1 ${isExpanded ? 'w-12 h-12' : 'w-14 h-14'}`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button 
            onClick={onNext} 
            className="text-pink-100/60 hover:text-pink-100 transition-all hover:scale-110 active:scale-90"
            title="Next"
          >
            ⏭
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
