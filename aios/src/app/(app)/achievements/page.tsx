"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Award, Zap, Star, Flame, Trophy, Code2, BookOpen, GitBranch } from "lucide-react";

const achievements = [
  { name: "First Commit", icon: GitBranch, unlocked: true, description: "Made your first commit" },
  {
    name: "Code Warrior",
    icon: Code2,
    unlocked: true,
    progress: 80,
    description: "Complete 100 coding challenges",
  },
  {
    name: "Knowledge Seeker",
    icon: BookOpen,
    unlocked: true,
    description: "Add 50 knowledge nodes",
  },
  {
    name: "Streak Master",
    icon: Flame,
    unlocked: false,
    progress: 60,
    description: "Maintain a 30-day streak",
  },
  { name: "100K XP", icon: Zap, unlocked: false, progress: 35, description: "Earn 100,000 XP" },
  {
    name: "Project Architect",
    icon: Star,
    unlocked: false,
    progress: 25,
    description: "Complete 10 projects",
  },
];

export default function AchievementsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Achievements</h1>
        <p className="mt-1 text-sm text-muted-foreground">Milestones in your engineering journey</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <GlassCard key={ach.name} className={`p-4 ${!ach.unlocked ? "opacity-50" : ""}`} hover>
            <div className="flex items-start justify-between mb-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${ach.unlocked ? "bg-accent-amber/10" : "bg-elevation-3"}`}
              >
                <ach.icon
                  className={`h-4.5 w-4.5 ${ach.unlocked ? "text-accent-amber" : "text-muted-foreground"}`}
                />
              </div>
              {ach.unlocked ? (
                <Badge variant="warning" size="sm">
                  Unlocked
                </Badge>
              ) : (
                <Badge variant="default" size="sm">
                  Locked
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-semibold mb-1">{ach.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{ach.description}</p>
            {ach.progress !== undefined && (
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{ach.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-elevation-3">
                  <div
                    className="h-full rounded-full bg-accent-amber transition-all"
                    style={{ width: `${ach.progress}%` }}
                  />
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
