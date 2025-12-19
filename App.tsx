
import React, { useState, useRef, useEffect } from 'react';
import SakuraEffect from './components/SakuraEffect';
import MusicPlayer from './components/MusicPlayer';
import PhotoWall from './components/PhotoWall';
import MusicVisualizer from './components/MusicVisualizer';
import { Song } from './types';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedSongs, setUploadedSongs] = useState<Song[]>([]);
  const [mouseBubbles, setMouseBubbles] = useState<{ id: number, x: number, y: number }[]>([]);
  const [playerMode, setPlayerMode] = useState<'compact' | 'expanded'>('compact');
  
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      setAudioEl(audioRef.current);
    }
  }, [audioRef.current]);

  useEffect(() => {
    if (isStarted && audioRef.current && uploadedSongs.length > 0) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.warn("Playback prevented:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isStarted, currentSongIndex, uploadedSongs]);

  const handleStart = () => {
    if (uploadedSongs.length === 0) {
      alert("请先上传至少一首音乐！");
      return;
    }
    setIsStarted(true);
    setIsPlaying(true);
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const tempCtx = new AudioContextClass();
      if (tempCtx.state === 'suspended') tempCtx.resume();
    }
  };

  const handleNext = () => {
    if (uploadedSongs.length === 0) return;
    setCurrentSongIndex((prev) => (prev + 1) % uploadedSongs.length);
    if (uploadedSongs.length === 1 && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    }
    setIsPlaying(true); 
  };

  const handlePrev = () => {
    if (uploadedSongs.length === 0) return;
    setCurrentSongIndex((prev) => (prev - 1 + uploadedSongs.length) % uploadedSongs.length);
    setIsPlaying(true); 
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setUploadedImages(prev => [...newImages, ...prev]);
      e.target.value = '';
    }
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newSongs: Song[] = Array.from(files).map((file: File, index) => ({
        id: `local-${Date.now()}-${index}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "本地音乐",
        url: URL.createObjectURL(file)
      }));
      setUploadedSongs(prev => [...prev, ...newSongs]);
      e.target.value = '';
      
      if (isStarted && uploadedSongs.length === 0) {
        setIsPlaying(true);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const newBubble = { id: Date.now(), x: e.clientX, y: e.clientY };
    setMouseBubbles((prev) => [...prev.slice(-15), newBubble]);
  };

  const currentSong = uploadedSongs[currentSongIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#fff0f3] font-sans" onMouseMove={handleMouseMove}>
      <audio 
        ref={audioRef}
        src={currentSong?.url || ""}
        onEnded={handleNext}
        crossOrigin="anonymous"
        preload="auto"
      />

      <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
      <input type="file" multiple accept="audio/*" ref={musicInputRef} onChange={handleMusicUpload} className="hidden" />

      {!isStarted ? (
        <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-pink-50 to-pink-100 opacity-80" />
          <SakuraEffect />
          
          <div className="relative z-10 flex flex-col items-center gap-6 p-10 bg-white/60 backdrop-blur-3xl rounded-[40px] shadow-[0_20px_50px_rgba(255,182,193,0.3)] border border-white animate-in fade-in zoom-in duration-700 max-w-md w-full mx-4">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 mb-2 font-serif tracking-wide">樱花照片墙</h1>
              <p className="text-rose-600/60 font-medium italic text-sm">Every petal tells a story of you...</p>
            </div>
            
            <div className="flex flex-col gap-4 w-full mt-4">
                <button onClick={() => fileInputRef.current?.click()} className="w-full px-6 py-4 bg-white/70 text-pink-600 font-bold rounded-2xl shadow-sm border border-white hover:bg-white/90 transition-all flex items-center justify-center gap-2 group">
                  <span className="text-xl group-hover:scale-125 transition-transform">📷</span> {uploadedImages.length > 0 ? `${uploadedImages.length} 张照片已选` : '上传照片 (可选)'}
                </button>
                <button onClick={() => musicInputRef.current?.click()} className="w-full px-6 py-4 bg-white/70 text-rose-600 font-bold rounded-2xl shadow-sm border border-white hover:bg-white/90 transition-all flex items-center justify-center gap-2 group">
                  <span className="text-xl group-hover:rotate-12 transition-transform">🎵</span> {uploadedSongs.length > 0 ? `${uploadedSongs.length} 首音乐已载入` : '上传音乐 (必须)'}
                </button>
                <button onClick={handleStart} disabled={uploadedSongs.length === 0} className={`w-full px-12 py-5 bg-gradient-to-br from-pink-400 to-rose-500 text-white font-bold rounded-2xl shadow-xl shadow-pink-200 transition-all duration-300 active:scale-95 mt-4 ${uploadedSongs.length === 0 ? 'opacity-40 grayscale' : 'hover:scale-[1.02] hover:brightness-105'}`}>
                  开启
                </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <PhotoWall customImages={uploadedImages} />
          <SakuraEffect />
          
          {/* 控制面板 - 调整为更高通透度的深色毛玻璃 */}
          <div className={`fixed bottom-8 z-[200] transition-all duration-700 ease-in-out flex flex-col gap-4 ${playerMode === 'expanded' ? 'left-8 right-8' : 'left-8 w-[440px]'}`}>
             <div className={`relative bg-[#1a0a0d]/45 backdrop-blur-3xl rounded-[32px] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.3)] w-full group transition-all duration-700 ${playerMode === 'expanded' ? 'py-4 px-10' : 'p-8'}`}>
                {/* 模式切换按钮 */}
                <button 
                  onClick={() => setPlayerMode(prev => prev === 'compact' ? 'expanded' : 'compact')}
                  className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-pink-200 transition-all active:scale-90 text-sm"
                  title={playerMode === 'compact' ? "展开铺满" : "收回界面"}
                >
                  {playerMode === 'compact' ? '⤢' : '⤡'}
                </button>

                <MusicVisualizer audioElement={audioEl} isPlaying={isPlaying} />
                
                <div className={`flex items-center gap-6 ${playerMode === 'expanded' ? 'justify-between' : ''}`}>
                  {currentSong && (
                    <MusicPlayer 
                      currentSong={currentSong}
                      isPlaying={isPlaying}
                      onTogglePlay={() => setIsPlaying(!isPlaying)}
                      onNext={handleNext}
                      onPrev={handlePrev}
                      mode={playerMode}
                    />
                  )}

                  {playerMode === 'expanded' && (
                    <div className="flex gap-3">
                      <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2 bg-pink-400/20 hover:bg-pink-400/40 text-pink-100 text-[10px] font-bold rounded-full transition-all border border-white/10">
                        + 照片
                      </button>
                      <button onClick={() => musicInputRef.current?.click()} className="px-5 py-2 bg-rose-400/20 hover:bg-rose-400/40 text-rose-100 text-[10px] font-bold rounded-full transition-all border border-white/10">
                        + 音乐
                      </button>
                    </div>
                  )}
                </div>
             </div>
             
             {playerMode === 'compact' && (
               <div className="flex gap-4 px-4 animate-in fade-in duration-500">
                 <button onClick={() => fileInputRef.current?.click()} className="px-8 py-2.5 bg-white/60 backdrop-blur-md text-pink-600 text-xs font-bold rounded-full shadow-md hover:bg-white/90 transition-all border border-white">
                    + 照片
                 </button>
                 <button onClick={() => musicInputRef.current?.click()} className="px-8 py-2.5 bg-white/60 backdrop-blur-md text-rose-600 text-xs font-bold rounded-full shadow-md hover:bg-white/90 transition-all border border-white">
                    + 音乐
                 </button>
               </div>
             )}
          </div>

          {/* 鼠标气泡拖尾 */}
          {mouseBubbles.map((bubble) => (
            <div 
              key={bubble.id}
              className="fixed w-2 h-2 bg-pink-400/30 rounded-full pointer-events-none z-[1000] animate-ping"
              style={{ left: bubble.x - 4, top: bubble.y - 4 }}
            />
          ))}

          {/* 播放列表 */}
          <div className="fixed top-8 right-8 z-[200] w-72 max-h-[50vh] bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 text-rose-900 shadow-xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-1000">
            <h3 className="text-rose-500 font-bold mb-5 flex items-center gap-2 text-xs tracking-[0.2em] uppercase">
              <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" /> Playlist
            </h3>
            <div className="overflow-y-auto custom-scrollbar flex-1 space-y-2 pr-1">
              {uploadedSongs.map((song, idx) => (
                <button
                  key={song.id}
                  onClick={() => {
                    setCurrentSongIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`w-full text-left px-5 py-4 rounded-[24px] transition-all duration-300 group ${idx === currentSongIndex ? 'bg-white/70 border border-white shadow-md scale-[1.02] text-rose-600' : 'hover:bg-white/40 text-rose-900/50 hover:text-rose-600'}`}
                >
                  <p className="font-bold truncate text-xs mb-0.5">{song.title}</p>
                  <p className="text-[10px] opacity-50 truncate group-hover:opacity-100">{song.artist}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
