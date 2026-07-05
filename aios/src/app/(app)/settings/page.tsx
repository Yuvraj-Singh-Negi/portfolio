"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { User, Bell, Palette, Key, GitBranch, ChevronRight } from "lucide-react";

type Section = "profile" | "notifications" | "appearance" | "api-keys" | "integrations";

const sections: { id: Section; label: string; icon: typeof User; description: string }[] = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    description: "Manage your account and preferences",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Configure notification settings",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    description: "Theme, colors, and layout",
  },
  { id: "api-keys", label: "API Keys", icon: Key, description: "Manage AI provider API keys" },
  {
    id: "integrations",
    label: "Integrations",
    icon: GitBranch,
    description: "GitHub, Slack, and more",
  },
];

function SectionContent({ id }: { id: Section }) {
  switch (id) {
    case "profile":
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-elevation-3 text-lg font-semibold">
              E
            </div>
            <div>
              <p className="text-sm font-medium">Engineer</p>
              <p className="text-xs text-muted-foreground">engineer@aios.dev</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Display Name</label>
              <input
                defaultValue="Engineer"
                className="w-full rounded-lg border border-border bg-elevation-1 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">North Star Goal</label>
              <input
                defaultValue="Build production-grade distributed systems"
                className="w-full rounded-lg border border-border bg-elevation-1 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      );
    case "notifications":
      return (
        <div className="space-y-3">
          {[
            { label: "Mission reminders", desc: "Notify before mission deadlines", enabled: true },
            {
              label: "Achievement alerts",
              desc: "When you unlock a new achievement",
              enabled: true,
            },
            { label: "AI insights", desc: "Daily AI mentor suggestions", enabled: false },
            { label: "GitHub events", desc: "PR reviews, issues, deployments", enabled: true },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <div
                className={`h-5 w-9 rounded-full transition-colors ${n.enabled ? "bg-accent-green" : "bg-elevation-3"} relative`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${n.enabled ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </div>
            </div>
          ))}
        </div>
      );
    case "appearance":
      return (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Color accent</p>
          <div className="flex gap-2">
            {["#22d3a0", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444"].map((c) => (
              <button
                key={c}
                className="h-8 w-8 rounded-full border-2 border-transparent hover:border-foreground transition-colors"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">Font size</p>
          <div className="flex gap-2">
            {["Sm", "Md", "Lg"].map((s) => (
              <button
                key={s}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-elevation-2 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      );
    case "api-keys":
      return (
        <div className="space-y-3">
          {["OpenAI", "Anthropic", "GitHub"].map((provider) => (
            <div
              key={provider}
              className="flex items-center justify-between rounded-lg border border-border bg-elevation-1 px-3 py-2.5"
            >
              <span className="text-sm font-medium">{provider}</span>
              <button className="rounded-md border border-border px-2.5 py-1 text-[11px] font-medium hover:bg-elevation-2 transition-colors">
                Configure
              </button>
            </div>
          ))}
        </div>
      );
    case "integrations":
      return (
        <div className="space-y-3">
          {[
            { name: "GitHub", connected: true, desc: "Syncing repositories and PRs" },
            { name: "Slack", connected: false, desc: "Not configured" },
            { name: "Notion", connected: false, desc: "Not configured" },
          ].map((i) => (
            <div
              key={i.name}
              className="flex items-center justify-between rounded-lg border border-border bg-elevation-1 px-3 py-2.5"
            >
              <div>
                <span className="text-sm font-medium">{i.name}</span>
                <p className="text-xs text-muted-foreground">{i.desc}</p>
              </div>
              <div
                className={`h-2 w-2 rounded-full ${i.connected ? "bg-accent-green" : "bg-elevation-3"}`}
              />
            </div>
          ))}
        </div>
      );
  }
}

export default function SettingsPage() {
  const [active, setActive] = useState<Section>("profile");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Configure your AIOS experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = active === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActive(section.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? "bg-elevation-2 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-elevation-1"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{section.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{section.description}</p>
                </div>
                <ChevronRight
                  className={`h-3.5 w-3.5 transition-transform ${isActive ? "rotate-90" : ""}`}
                />
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <GlassCard className="p-5">
                <SectionContent id={active} />
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
