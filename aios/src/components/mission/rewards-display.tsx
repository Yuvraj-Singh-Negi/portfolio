"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import type { Rewards } from "@/features/mission/engine";

const badgeLabels: Record<string, string> = {
  "weekly-warrior": "Weekly Warrior",
  "iron-will": "Iron Will",
  "laser-focus": "Laser Focus",
  "speed-runner": "Speed Runner",
};

export function RewardsDisplay({ rewards }: { rewards: Rewards }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-4 text-center">
        <p className="text-xs text-muted-foreground mb-2">Mission Complete</p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="text-3xl font-bold text-accent-green"
        >
          +{rewards.totalXp} XP
        </motion.div>

        <div className="mt-3 flex justify-center gap-4 text-xs text-muted-foreground">
          <span>Base: {rewards.xp - rewards.streakBonus}</span>
          {rewards.streakBonus > 0 && (
            <span className="text-accent-amber">Streak: +{rewards.streakBonus}</span>
          )}
        </div>

        {rewards.badges.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {rewards.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-accent-green/10 px-2.5 py-0.5 text-[11px] font-medium text-accent-green"
              >
                {badgeLabels[badge] ?? badge}
              </span>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
