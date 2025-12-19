
import React, { useEffect, useRef } from 'react';

interface MusicVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ audioElement, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioElement || !canvasRef.current) return;

    const initAudio = () => {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (!sourceRef.current && audioCtxRef.current && audioElement) {
        try {
          sourceRef.current = audioCtxRef.current.createMediaElementSource(audioElement);
          analyserRef.current = audioCtxRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioCtxRef.current.destination);
        } catch (err) {
          console.error("频谱初始化失败:", err);
        }
      }
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const bufferLength = analyserRef.current?.frequencyBinCount || 0;
      const dataArray = new Uint8Array(bufferLength);
      
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (bufferLength > 0) {
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
          
          if (barHeight > 2) {
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            // 增强对比度，使用更鲜艳的亮粉色和深红色
            gradient.addColorStop(0, 'rgba(244, 114, 182, 0.4)'); // text-pink-400
            gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.7)'); // text-pink-500
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)'); // 顶部发白光，增加可见度

            ctx.fillStyle = gradient;
            
            // 稍微加宽条形，使其更厚实
            const r = 1.5;
            const y = canvas.height - barHeight;
            const w = Math.max(1.5, barWidth - 1.5);
            const h = barHeight;
            
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
            ctx.fill();
            
            // 添加发光感
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(236, 72, 153, 0.3)';
          }
          x += barWidth;
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    const handleGesture = () => {
      initAudio();
    };

    window.addEventListener('click', handleGesture);
    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('click', handleGesture);
    };
  }, [audioElement, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      width={1200} 
      height={80} 
      className="w-full h-10 opacity-90 pointer-events-none mb-3"
    />
  );
};

export default MusicVisualizer;
