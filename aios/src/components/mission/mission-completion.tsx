"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BrainCircuit, TrendingUp, GitCommit, BookOpen, Zap } from "lucide-react";

interface CompletionData {
  missionName: string;
  timeSpent: number;
  focusScore: number;
  gitCommits: number;
  knowledgeGained: string[];
  xpEarned: number;
}

interface MissionCompletionProps {
  data: CompletionData;
  onClose: () => void;
  onReflect: (reflection: string) => void;
}

function NeuralPulseAnimation() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="absolute h-32 w-32 rounded-full border border-accent-green/30"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.5, 2], opacity: [0, 0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute h-24 w-24 rounded-full border border-accent-purple/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.4, 1.8], opacity: [0, 0.2, 0] }}
        transition={{ duration: 2, delay: 0.3, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent-green/10"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <CheckCircle2 className="h-10 w-10 text-accent-green" />
      </motion.div>
      <motion.div
        className="absolute h-16 w-16 rounded-full bg-accent-green/5"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  );
}

function NodeActivation({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: -10 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="flex items-center gap-2 rounded-lg border border-accent-green/20 bg-accent-green/5 px-3 py-2"
    >
      <div className="h-2 w-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(34,211,160,0.5)]" />
      <span className="text-sm text-accent-green">{label}</span>
    </motion.div>
  );
}

export function MissionCompletion({ data, onClose, onReflect }: MissionCompletionProps) {
  const [reflection, setReflection] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-lg"
      >
        <GlassCard className="p-6" glow="green">
          <div className="flex flex-col items-center text-center mb-6">
            <NeuralPulseAnimation />
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-bold mt-4"
            >
              Mission Complete
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground mt-1"
            >
              {data.missionName}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2 mb-6"
          >
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">
                +{data.xpEarned} XP
              </Badge>
              <Badge variant="default" size="sm">
                {data.timeSpent} min spent
              </Badge>
              <Badge variant="knowledge" size="sm">
                Focus: {data.focusScore}%
              </Badge>
              <Badge variant="default" size="sm">
                {data.gitCommits} commits
              </Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-2 mb-6"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Knowledge Graph Updated
            </p>
            <div className="grid grid-cols-2 gap-2">
              {data.knowledgeGained.map((item, i) => (
                <NodeActivation key={item} label={item} delay={1 + i * 0.15} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mb-4"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Quick Reflection
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you learn? What would you do differently?"
              className="w-full rounded-lg border border-border bg-elevation-1 p-3 text-xs outline-none resize-none h-20 placeholder:text-muted-foreground focus:border-accent-green/30"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex items-center gap-2"
          >
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                onReflect(reflection);
                onClose();
              }}
            >
              <Zap className="h-3.5 w-3.5" />
              Save & Continue
            </Button>
            <Button size="sm" variant="secondary" className="flex-1" onClick={onClose}>
              Skip Reflection
            </Button>
          </motion.div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
