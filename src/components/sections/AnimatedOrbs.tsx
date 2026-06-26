"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Orb {
  id: number;
  size: number;
  xRange: [number, number];
  yRange: [number, number];
  duration: number;
  blur: number;
}

const orbs: Orb[] = [
  { id: 1, size: 400, xRange: [-60, 60], yRange: [-80, 80], duration: 14, blur: 120 },
  { id: 2, size: 350, xRange: [40, -40], yRange: [50, -50], duration: 18, blur: 100 },
  { id: 3, size: 300, xRange: [-30, 30], yRange: [-40, 40], duration: 12, blur: 80 },
];

function Orb({ orb }: { orb: Orb }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 30, damping: 15, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 30, damping: 15, mass: 0.5 });

  useEffect(() => {
    let start: number | null = null;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const t = (timestamp - start) / 1000;

      const progress = (t % orb.duration) / orb.duration;
      const angle = progress * Math.PI * 2;

      x.set(Math.sin(angle) * orb.xRange[0] + Math.sin(angle * 0.7) * orb.xRange[1] * 0.5);
      y.set(Math.cos(angle) * orb.yRange[0] + Math.cos(angle * 0.5) * orb.yRange[1] * 0.5);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [orb, x, y]);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: orb.size,
        height: orb.size,
        x: springX,
        y: springY,
        background:
          "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
        filter: `blur(${orb.blur}px)`,
      }}
      aria-hidden="true"
    />
  );
}

export function AnimatedOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center overflow-hidden" aria-hidden="true">
      <div className="relative h-full w-full max-w-5xl">
        {orbs.map((orb) => (
          <Orb key={orb.id} orb={orb} />
        ))}
      </div>
    </div>
  );
}
