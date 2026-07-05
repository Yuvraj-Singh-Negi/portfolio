"use client";

import { useEffect, useRef } from "react";

interface Neuron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  layer: number;
  firing: boolean;
  fireTimer: number;
}

export function NeuralNetwork({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const neuronsRef = useRef<Neuron[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const layerCount = 4;
    const neuronsPerLayer = 6;
    const neurons: Neuron[] = [];

    for (let l = 0; l < layerCount; l++) {
      for (let n = 0; n < neuronsPerLayer; n++) {
        neurons.push({
          x: (l / (layerCount - 1)) * canvas.width,
          y: ((n + 0.5) / neuronsPerLayer) * canvas.height + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          layer: l,
          firing: false,
          fireTimer: 0,
        });
      }
    }
    neuronsRef.current = neurons;

    let lastFire = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const neurons = neuronsRef.current;
      const now = Date.now();

      if (active && now - lastFire > 800 + Math.random() * 1200) {
        const sourceLayer = Math.floor(Math.random() * (layerCount - 1));
        const sourceNeurons = neurons.filter((n) => n.layer === sourceLayer);
        if (sourceNeurons.length > 0) {
          const source = sourceNeurons[Math.floor(Math.random() * sourceNeurons.length)];
          source.firing = true;
          source.fireTimer = 0;
          lastFire = now;
        }
      }

      for (let i = 0; i < neurons.length; i++) {
        const n = neurons[i];
        n.x += n.vx * 0.3;
        n.y += n.vy * 0.3;

        if (n.x < -20 || n.x > canvas.width + 20) n.vx *= -1;
        if (n.y < -20 || n.y > canvas.height + 20) n.vy *= -1;

        if (n.firing) {
          n.fireTimer++;
          if (n.fireTimer > 60) n.firing = false;

          const nextLayerNeurons = neurons.filter((m) => m.layer === n.layer + 1);
          for (const target of nextLayerNeurons) {
            const progress = Math.min(n.fireTimer / 40, 1);
            const cx = n.x + (target.x - n.x) * progress;
            const cy = n.y + (target.y - n.y) * progress;
            ctx.beginPath();
            ctx.arc(cx, cy, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(34, 211, 160, ${0.8 * (1 - progress)})`;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(34, 211, 160, ${0.15 * (1 - progress)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw connections
        const nextLayer = neurons.filter((m) => m.layer === n.layer + 1);
        for (const target of nextLayer) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = `rgba(34, 211, 160, ${n.firing ? 0.15 : 0.04})`;
          ctx.lineWidth = n.firing ? 1.5 : 0.5;
          ctx.stroke();
        }

        // Draw neuron
        const radius = n.firing ? 4 : 2.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = n.firing
          ? `rgba(34, 211, 160, 0.9)`
          : `rgba(34, 211, 160, ${0.2 + n.layer * 0.05})`;
        ctx.fill();

        if (n.firing) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(34, 211, 160, 0.05)";
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-30" />;
}
