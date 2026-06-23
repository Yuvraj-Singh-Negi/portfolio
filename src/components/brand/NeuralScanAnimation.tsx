"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface NeuralScanAnimationProps {
  active?: boolean;
  speed?: number;
  className?: string;
}

export function NeuralScanAnimation({
  active = true,
  speed = 1,
  className,
}: NeuralScanAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
    }> = [];

    const numNodes = 30;
    const connectionDistance = 80;

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    function resize() {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    resize();
    window.addEventListener("resize", resize);

    function animate() {
      if (!ctx || !canvas) return;
      time += 0.005 * speed;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scanY = ((time * 100) % (canvas.height + 100)) - 50;

      // Draw scanning line
      const gradient = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, "rgba(125, 211, 252, 0.15)");
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 15, canvas.width, 30);

      // Scanning line
      ctx.strokeStyle = "rgba(125, 211, 252, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!;
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const distFromScan = Math.abs(node.y - scanY);
        const nodeOpacity = Math.max(0.1, 1 - distFromScan / 100);

        ctx.fillStyle = `rgba(125, 211, 252, ${nodeOpacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j]!;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const bothNearScan =
              Math.abs(node.y - scanY) < 60 &&
              Math.abs(other.y - scanY) < 60;
            const alpha = bothNearScan
              ? (1 - dist / connectionDistance) * 0.3
              : (1 - dist / connectionDistance) * 0.08;

            ctx.strokeStyle = `rgba(125, 211, 252, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [active, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none h-full w-full", className)}
    />
  );
}
