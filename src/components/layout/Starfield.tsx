'use client';
import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    let W: number, H: number;
    let pts: {x: number, y: number, z: number, pz: number}[] = [];
    
    const init = () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    };
    init();
    window.addEventListener('resize', init);
    
    for (let i = 0; i < 280; i++) {
      pts.push({
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 2000 - 1000,
        z: Math.random() * 1000,
        pz: 0
      });
    }
    
    let mx = 0, my = 0;
    const handleMouse = (e: MouseEvent) => {
      mx = (e.clientX / W - 0.5) * 0.25;
      my = (e.clientY / H - 0.5) * 0.25;
    };
    window.addEventListener('mousemove', handleMouse);
    
    let animationId: number;
    const frame = () => {
      cx.fillStyle = 'rgba(4,3,5,.17)';
      cx.fillRect(0, 0, W, H);
      
      const ox = W / 2 + mx * 60;
      const oy = H / 2 + my * 60;
      
      pts.forEach(p => {
        p.pz = p.z;
        p.z -= 1.0;
        if (p.z <= 0) {
          p.x = Math.random() * 2000 - 1000;
          p.y = Math.random() * 2000 - 1000;
          p.z = 1000;
          p.pz = 1000;
        }
        const sx = (p.x / p.z) * 400 + ox;
        const sy = (p.y / p.z) * 400 + oy;
        const px = (p.x / p.pz) * 400 + ox;
        const py = (p.y / p.pz) * 400 + oy;
        
        const b = 1 - p.z / 1000;
        const sz = Math.max(0.1, b * 1.8);
        
        cx.beginPath();
        cx.moveTo(px, py);
        cx.lineTo(sx, sy);
        cx.strokeStyle = `rgba(201,149,42,${b * 0.45})`;
        cx.lineWidth = sz;
        cx.stroke();
      });
      animationId = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} id="stars" className="fixed inset-0 z-0 pointer-events-none" />;
}
