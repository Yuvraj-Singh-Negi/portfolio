"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { BarChart3, TrendingUp, Clock, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Engineering productivity metrics and insights
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Coding Hours",
            value: "127h",
            change: "+12%",
            icon: Clock,
            color: "text-accent-green",
          },
          {
            label: "Commits",
            value: "342",
            change: "+28%",
            icon: Activity,
            color: "text-accent-blue",
          },
          {
            label: "PRs Merged",
            value: "48",
            change: "+8%",
            icon: TrendingUp,
            color: "text-accent-purple",
          },
          {
            label: "Modules Completed",
            value: "23",
            change: "+5",
            icon: BarChart3,
            color: "text-accent-cyan",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.label} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p
                className={`text-xs mt-0.5 ${stat.change.startsWith("+") ? "text-accent-green" : "text-muted-foreground"}`}
              >
                {stat.change} vs last month
              </p>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <GlassCard className="h-64 p-4 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Activity chart loading...</p>
          </div>
        </GlassCard>
        <GlassCard className="h-64 p-4 flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Skill growth chart loading...</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
