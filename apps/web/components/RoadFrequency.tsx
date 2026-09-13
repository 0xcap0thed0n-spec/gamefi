"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
};

/**
 * Oscilloscope-style frequency canvas for the hero road grid.
 * Idle: fast sweeping wavelength / amplitude.
 * Hover: hotter signal + local frequency keyed to pointer X.
 */
export function RoadFrequency({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef(false);
  const pointerXRef = useRef(0.5);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(width));
      const h = Math.max(1, Math.floor(height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const layers = [
      { color: "rgba(0, 245, 255, 0.9)", width: 1.6, amp: 0.28, baseFreq: 3.2, speed: 9.5, phase: 0 },
      { color: "rgba(255, 45, 149, 0.75)", width: 1.25, amp: 0.2, baseFreq: 5.4, speed: 13.2, phase: 1.7 },
      { color: "rgba(185, 103, 255, 0.5)", width: 1, amp: 0.14, baseFreq: 2.1, speed: 6.8, phase: 3.1 },
    ];

    const draw = (now: number) => {
      if (!running) return;
      const { width, height } = wrap.getBoundingClientRect();
      const w = Math.max(1, width);
      const h = Math.max(1, height);
      const t = now / 1000;
      const hot = hoverRef.current;
      const px = pointerXRef.current;

      ctx.clearRect(0, 0, w, h);

      // faint baseline
      ctx.strokeStyle = "rgba(0, 245, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.55);
      ctx.lineTo(w, h * 0.55);
      ctx.stroke();

      for (const layer of layers) {
        // Frequency sweeps low → high → low (chirp), faster when hovered.
        const sweep = 0.5 + 0.5 * Math.sin(t * (hot ? 2.8 : 1.35) + layer.phase);
        const hoverBoost = hot ? 1.55 + px * 1.1 : 1;
        const cycles = (layer.baseFreq + sweep * (hot ? 10 : 6.5)) * hoverBoost;
        const amp =
          h *
          layer.amp *
          (0.55 + 0.45 * Math.sin(t * (hot ? 4.2 : 2.1) + layer.phase * 1.3)) *
          (hot ? 1.35 : 1);
        const phase = t * layer.speed * (hot ? 1.85 : 1) + layer.phase + (hot ? px * Math.PI * 2 : 0);

        ctx.beginPath();
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = layer.width * (hot ? 1.25 : 1);
        ctx.shadowColor = layer.color;
        ctx.shadowBlur = hot ? 8 : 4;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        const mid = h * 0.55;
        const steps = Math.max(80, Math.floor(w / 3));
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * w;
          // Spatial chirp: left = lower freq, right = higher, plus time sweep
          const localFreq = cycles * (0.55 + (x / w) * 0.9);
          const y =
            mid +
            Math.sin((x / w) * localFreq * Math.PI * 2 + phase) * amp +
            Math.sin((x / w) * localFreq * 0.37 * Math.PI * 2 - phase * 0.6) * amp * 0.28;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      if (!reduceMotion) {
        raf = requestAnimationFrame(draw);
      }
    };

    if (reduceMotion) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduceMotion]);

  return (
    <div
      ref={wrapRef}
      className={className}
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
      onPointerMove={(e) => {
        const rect = wrapRef.current?.getBoundingClientRect();
        if (!rect || rect.width <= 0) return;
        pointerXRef.current = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      }}
    >
      <canvas ref={canvasRef} className="road-freq-canvas" aria-hidden />
    </div>
  );
}
