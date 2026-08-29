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
    
    const init = () => {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
    };
    init();
    window.addEventListener('resize', init);
    
    // Performance optimization: Pre-allocate continuous TypedArray to store particle data (x, y, z, pz)
    // to eliminate garbage collection pressure and object pointer chasing during 60fps renders.
    const STAR_COUNT = 280;
    const pts = new Float32Array(STAR_COUNT * 4);
    for (let i = 0; i < STAR_COUNT; i++) {
      const idx = i * 4;
      pts[idx] = Math.random() * 2000 - 1000;     // x
      pts[idx + 1] = Math.random() * 2000 - 1000; // y
      pts[idx + 2] = Math.random() * 1000;        // z
      pts[idx + 3] = 0;                           // pz
    }

    // Performance optimization: Pre-compute fixed opacity strokeStyle strings (100 discrete alpha steps)
    // to eliminate 16,800 string template allocations and string parsing per second.
    const COLOR_CACHE = new Array(101);
    for (let i = 0; i <= 100; i++) {
      COLOR_CACHE[i] = `rgba(201,149,42,${((i / 100) * 0.45).toFixed(3)})`;
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
      
      // Traditional indexed loop over Float32Array replaces Array.prototype.forEach callback allocations
      for (let i = 0; i < STAR_COUNT; i++) {
        const idx = i * 4;
        let x = pts[idx];
        let y = pts[idx + 1];
        let z = pts[idx + 2];
        let pz = z;

        z -= 1.0;
        if (z <= 0) {
          x = Math.random() * 2000 - 1000;
          y = Math.random() * 2000 - 1000;
          z = 1000;
          pz = 1000;
          pts[idx] = x;
          pts[idx + 1] = y;
        }
        pts[idx + 2] = z;
        pts[idx + 3] = pz;

        const sx = (x / z) * 400 + ox;
        const sy = (y / z) * 400 + oy;
        const px = (x / pz) * 400 + ox;
        const py = (y / pz) * 400 + oy;
        
        const b = 1 - z / 1000;
        const sz = Math.max(0.1, b * 1.8);
        const colorIdx = Math.min(100, Math.max(0, (b * 100) | 0));
        
        cx.beginPath();
        cx.moveTo(px, py);
        cx.lineTo(sx, sy);
        cx.strokeStyle = COLOR_CACHE[colorIdx];
        cx.lineWidth = sz;
        cx.stroke();
      }
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
