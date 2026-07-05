"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Target, BookOpen, Briefcase, BarChart3, ArrowRight, X } from "lucide-react";

const STORAGE_KEY = "aios-tutorial-seen";

const steps = [
  {
    title: "Welcome to AIOS",
    description:
      "Your Engineering Operating System — a mission control center for your engineering growth journey.",
    icon: Bot,
    color: "text-accent-purple",
    bg: "bg-accent-purple/10",
  },
  {
    title: "Missions",
    description:
      "Complete structured missions to build real engineering skills. Each mission has a checklist, timeline, and AI guidance.",
    icon: Target,
    color: "text-accent-green",
    bg: "bg-accent-green/10",
  },
  {
    title: "Learning",
    description:
      "Follow curated roadmaps, revise with spaced repetition, and track your skill growth across engineering domains.",
    icon: BookOpen,
    color: "text-accent-blue",
    bg: "bg-accent-blue/10",
  },
  {
    title: "Projects",
    description:
      "Manage your engineering projects with Kanban boards, milestone tracking, and deployment history.",
    icon: Briefcase,
    color: "text-accent-amber",
    bg: "bg-accent-amber/10",
  },
  {
    title: "AI Mentor",
    description:
      "Your personal cognitive engine. Chat, get code reviews, architecture analysis, and research assistance.",
    icon: Bot,
    color: "text-accent-purple",
    bg: "bg-accent-purple/10",
  },
  {
    title: "Analytics",
    description:
      "Track your engineering metrics, streaks, skill growth, and productivity over time.",
    icon: BarChart3,
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10",
  },
];

export function WelcomeTutorial() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(STORAGE_KEY);
  });
  const [step, setStep] = useState(0);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  const current = steps[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
              <button
                onClick={dismiss}
                className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center text-center mb-8">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${current.bg} mb-4`}
                >
                  <Icon className={`h-8 w-8 ${current.color}`} />
                </div>
                <h2 className="text-xl font-bold tracking-tight mb-2">{current.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {current.description}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 mb-6">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step ? "w-6 bg-accent-green" : "w-1.5 bg-elevation-3"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={dismiss}
                  className="flex-1 rounded-lg border border-border bg-elevation-1 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip tour
                </button>
                <button
                  onClick={() => {
                    if (step < steps.length - 1) {
                      setStep(step + 1);
                    } else {
                      dismiss();
                    }
                  }}
                  className="flex-1 rounded-lg bg-accent-green px-4 py-2.5 text-xs font-semibold text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                >
                  {step < steps.length - 1 ? (
                    <>
                      Next
                      <ArrowRight className="h-3 w-3" />
                    </>
                  ) : (
                    "Get started"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
