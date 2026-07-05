"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootStep {
  label: string;
  status: "pending" | "loading" | "done" | "error";
}

const bootSteps: BootStep[] = [
  { label: "System initialization", status: "pending" },
  { label: "AI Kernel loading", status: "pending" },
  { label: "Mission Engine starting", status: "pending" },
  { label: "Knowledge Graph synchronizing", status: "pending" },
  { label: "GitHub integration connecting", status: "pending" },
  { label: "Memory Engine initializing", status: "pending" },
  { label: "System online", status: "pending" },
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [steps, setSteps] = useState<BootStep[]>(() =>
    bootSteps.map((s, i) => ({
      ...s,
      status: (i === 0 ? "loading" : "pending") as BootStep["status"],
    })),
  );
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setSteps((prev) => prev.map((s, i) => (i === 0 ? { ...s, status: "done" as const } : s)));
        setTimeout(() => setCurrentStep(1), 150);
      },
      400 + Math.random() * 300,
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentStep < 1 || currentStep >= bootSteps.length) return;

    const loadTimer = setTimeout(() => {
      setSteps((prev) =>
        prev.map((s, i) => (i === currentStep ? { ...s, status: "loading" as const } : s)),
      );
    }, 0);

    const doneTimer = setTimeout(
      () => {
        setSteps((prev) =>
          prev.map((s, i) => (i === currentStep ? { ...s, status: "done" as const } : s)),
        );
        if (currentStep < bootSteps.length - 1) {
          setTimeout(() => setCurrentStep(currentStep + 1), 150);
        } else {
          setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 500);
          }, 400);
        }
      },
      400 + Math.random() * 300,
    );

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(doneTimer);
    };
  }, [currentStep, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          <div className="mb-8 flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green"
            >
              <span className="text-lg font-bold text-black">A</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-semibold tracking-tight"
            >
              AIOS
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-muted-foreground"
            >
              v0.1
            </motion.span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-80 space-y-2"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 font-mono text-xs"
              >
                <span
                  className={`w-4 text-center ${
                    step.status === "done"
                      ? "text-accent-green"
                      : step.status === "loading"
                        ? "text-accent-amber"
                        : "text-muted-foreground/40"
                  }`}
                >
                  {step.status === "done" ? "OK" : step.status === "loading" ? "->" : "--"}
                </span>
                <span
                  className={`${
                    step.status === "done"
                      ? "text-accent-green"
                      : step.status === "loading"
                        ? "text-accent-amber"
                        : "text-muted-foreground/40"
                  }`}
                >
                  {step.label}
                </span>
                {step.status === "loading" && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-accent-amber"
                  >
                    ...
                  </motion.span>
                )}
                {step.status === "done" && <span className="text-accent-green">✓</span>}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 h-0.5 w-80 overflow-hidden rounded-full bg-elevation-3"
          >
            <motion.div
              className="h-full rounded-full bg-accent-green"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep + 1) / bootSteps.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Subtle code rain in background */}
          <div className="pointer-events-none fixed inset-0 opacity-[0.03]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,160,0.3) 2px, rgba(34,211,160,0.3) 3px)",
                backgroundSize: "100% 3px",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
