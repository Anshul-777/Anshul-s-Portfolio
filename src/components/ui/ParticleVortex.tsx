import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
  angle: number;
  radius: number;
}

export const ParticleVortex: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [shake, setShake] = useState({ x: 0, y: 0 });
  const frameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const particleCount = 1500;
    
    // Theme colors
    const colors = {
      light: ['#6366f1', '#a855f7', '#ec4899'], // Indigo, Purple, Pink
      dark: ['#ffffff', '#ff00ff', '#8b5cf6'],   // White, Magenta, Violet
      vibrant: ['#ffffff', '#ff00ff', '#00ffff'], // White, Magenta, Cyan
    };

    const currentColors = colors[theme as keyof typeof colors] || colors.dark;

    const createParticle = (isInitial = false): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 200 + 50;
      return {
        x: Math.cos(angle) * radius,
        y: isInitial ? Math.random() * height : height + 50,
        z: Math.random() * 400 - 200,
        vx: 0,
        vy: -(Math.random() * 0.4 + 0.2), // Reduced for cinematic effect
        vz: 0,
        size: Math.random() * 2 + 0.5,
        color: currentColors[Math.floor(Math.random() * currentColors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        angle: angle,
        radius: radius,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Nebula-like gradient background
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width
      );
      if (theme === 'light') {
        grad.addColorStop(0, 'rgba(240, 245, 255, 0.5)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      } else {
        grad.addColorStop(0, 'rgba(30, 0, 50, 0.4)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      let totalSpeed = 0;

      particles.forEach((p, i) => {
        // Vertical motion: Faster at the top
        const normalizedY = p.y / height;
        const speedMultiplier = 1 + (1 - normalizedY) * 1.5; // Reduced from 2 to 1.5
        p.y += p.vy * speedMultiplier;

        // Swirling vortex motion: Slower attraction speed
        p.angle += 0.003 * speedMultiplier; // Reduced from 0.006 to 0.003
        // Reversed vortex: Wider at the top
        const baseRadius = p.radius;
        const radiusAtY = Math.max(1, baseRadius * (1 + (1 - normalizedY) * 1.2));
        
        const targetX = width / 2 + Math.cos(p.angle) * radiusAtY;
        const targetZ = Math.sin(p.angle) * radiusAtY;
        
        p.x = targetX;
        p.z = targetZ;

        totalSpeed += Math.abs(p.vy * speedMultiplier);

        // Drawing
        const depth = Math.max(1, 400 + p.z);
        const scale = 400 / depth; // Simple 3D projection
        const drawSize = Math.max(0.1, p.size * scale);
        const drawX = p.x;
        const drawY = p.y;

        ctx.beginPath();
        ctx.arc(drawX, drawY, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (p.y / height); // Fade out as it moves up or down?
        // Actually, user said speed up at top, so let's fade out at very top
        if (p.y < 100) ctx.globalAlpha *= (p.y / 100);
        
        ctx.fill();

        // Respawn
        if (p.y < -50) {
          particles[i] = createParticle();
        }
      });

      // Screen shake logic
      if (totalSpeed / particleCount > 5) {
        setShake({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
        });
      } else {
        setShake({ x: 0, y: 0 });
      }

      frameId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId.current);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        transform: `translate(${shake.x}px, ${shake.y}px)`,
        filter: theme === 'vibrant' ? 'contrast(1.2) brightness(1.2)' : 'none',
        mixBlendMode: theme === 'light' ? 'multiply' : 'screen',
      }}
    />
  );
};
