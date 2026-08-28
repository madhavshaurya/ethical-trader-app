'use client';
import { useEffect, useRef } from 'react';

// Pre-computed color & line width lookup tables (10 buckets for alpha/brightness)
// Prevents dynamic string allocation `rgba(201,149,42,${b * 0.45})` 280 times per frame at 60 FPS (~16.8k allocations/sec)
const COLOR_BUCKETS_COUNT = 10;
const COLOR_LOOKUP = Array.from({ length: COLOR_BUCKETS_COUNT }, (_, i) => {
  const alpha = ((i + 1) / COLOR_BUCKETS_COUNT) * 0.45;
  return `rgba(201,149,42,${alpha.toFixed(3)})`;
});

const WIDTH_LOOKUP = Array.from({ length: COLOR_BUCKETS_COUNT }, (_, i) => {
  const b = (i + 0.5) / COLOR_BUCKETS_COUNT;
  return Math.max(0.1, b * 1.8);
});

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;

    let W: number, H: number;
    const pts: { x: number; y: number; z: number; pz: number }[] = [];

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
        pz: 0,
      });
    }

    let mx = 0,
      my = 0;
    const handleMouse = (e: MouseEvent) => {
      mx = (e.clientX / W - 0.5) * 0.25;
      my = (e.clientY / H - 0.5) * 0.25;
    };
    window.addEventListener('mousemove', handleMouse);

    let animationId: number;

    // Performance Optimization:
    // 1. Pre-bucket stars by discrete brightness levels so strokeStyle, lineWidth, and beginPath/stroke calls
    //    are batched per bucket (reducing state changes & draw calls from 280/frame to ~10/frame).
    // 2. Eliminate per-frame template string creation (`rgba(...)`), eliminating ~16,800 allocations/sec
    //    and reducing Garbage Collection (GC) pauses on the main thread.
    const buckets: { px: number; py: number; sx: number; sy: number }[][] = Array.from(
      { length: COLOR_BUCKETS_COUNT },
      () => []
    );

    const frame = () => {
      cx.fillStyle = 'rgba(4,3,5,.17)';
      cx.fillRect(0, 0, W, H);

      const ox = W / 2 + mx * 60;
      const oy = H / 2 + my * 60;

      // Clear buckets
      for (let i = 0; i < COLOR_BUCKETS_COUNT; i++) {
        buckets[i].length = 0;
      }

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.pz = p.z;
        p.z -= 1.0;
        if (p.z <= 0) {
          p.x = Math.random() * 2000 - 1000;
          p.y = Math.random() * 2000 - 1000;
          p.z = 1000;
          p.pz = 1000;
        }
        const invZ = 1 / p.z;
        const invPz = 1 / p.pz;

        const sx = p.x * invZ * 400 + ox;
        const sy = p.y * invZ * 400 + oy;
        const px = p.x * invPz * 400 + ox;
        const py = p.y * invPz * 400 + oy;

        const b = 1 - p.z * 0.001;
        // Bucket index from 0 to COLOR_BUCKETS_COUNT - 1
        const bIdx = Math.min(COLOR_BUCKETS_COUNT - 1, Math.floor(b * COLOR_BUCKETS_COUNT));
        buckets[bIdx].push({ px, py, sx, sy });
      }

      // Render by bucket
      for (let b = 0; b < COLOR_BUCKETS_COUNT; b++) {
        const starGroup = buckets[b];
        if (starGroup.length === 0) continue;

        cx.strokeStyle = COLOR_LOOKUP[b];
        cx.lineWidth = WIDTH_LOOKUP[b];
        
        // Render lines in the current brightness bucket
        cx.beginPath();
        for (let i = 0; i < starGroup.length; i++) {
          const s = starGroup[i];
          cx.moveTo(s.px, s.py);
          cx.lineTo(s.sx, s.sy);
        }
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
