"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function EmeraldWave({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number }[]>(() => {
    if (!trigger) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: (i / 12) * 100,
      delay: i * 0.08,
    }));
  });

  useEffect(() => {
    if (!trigger) {
      const t = setTimeout(() => setParticles([]), 0);
      return () => clearTimeout(t);
    }

    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: (i / 12) * 100,
      delay: i * 0.08,
    }));

    const loadTimer = setTimeout(() => setParticles(newParticles), 0);
    const cleanupTimer = setTimeout(() => setParticles([]), 2000);
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(cleanupTimer);
    };
  }, [trigger]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}vw`,
                y: -20,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                y: "100vh",
                opacity: [1, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                delay: p.delay,
                ease: "easeInOut",
              }}
              className="absolute h-2 w-2 rounded-full bg-accent-green shadow-[0_0_10px_rgba(34,211,160,0.8),0_0_20px_rgba(34,211,160,0.4)]"
              style={{ left: `${p.x}%` }}
            />
          ))}
          <motion.div
            initial={{ y: "-10%", opacity: 0 }}
            animate={{ y: "110%", opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-green/50 to-transparent"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
