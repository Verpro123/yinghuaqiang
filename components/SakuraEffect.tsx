
import React, { useEffect, useRef } from 'react';
import { SakuraPetal } from '../types';

const SakuraEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let petals: SakuraPetal[] = [];
    const petalCount = 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createPetals = () => {
      petals = [];
      for (let i = 0; i < petalCount; i++) {
        petals.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          w: 10 + Math.random() * 15,
          h: 10 + Math.random() * 10,
          opacity: Math.random(),
          flip: Math.random(),
          flipSpeed: 0.01 + Math.random() * 0.03,
          ySpeed: 1 + Math.random() * 1.5,
          xSpeed: -1 + Math.random() * 2,
        });
      }
    };

    const drawPetal = (p: SakuraPetal) => {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.flip * Math.PI);
      ctx.scale(Math.sin(p.flip), 1);
      
      // Petal shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.w / 2, -p.h / 2, p.w, p.h / 2, 0, p.h);
      ctx.bezierCurveTo(-p.w, p.h / 2, -p.w / 2, -p.h / 2, 0, 0);
      
      // Pink gradient
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.w);
      grad.addColorStop(0, `rgba(255, 192, 203, ${p.opacity})`);
      grad.addColorStop(1, `rgba(255, 182, 193, ${p.opacity * 0.5})`);
      
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((p) => {
        p.y += p.ySpeed;
        p.x += p.xSpeed + Math.sin(p.y * 0.01);
        p.flip += p.flipSpeed;

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(update);
    };

    window.addEventListener('resize', resize);
    resize();
    createPetals();
    update();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100]"
    />
  );
};

export default SakuraEffect;
