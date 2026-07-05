"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Palette, Key, GitBranch } from "lucide-react";

const sections = [
  { label: "Profile", icon: User, description: "Manage your account and preferences" },
  { label: "Notifications", icon: Bell, description: "Configure notification settings" },
  { label: "Appearance", icon: Palette, description: "Theme, colors, and layout" },
  { label: "API Keys", icon: Key, description: "Manage AI provider API keys" },
  { label: "Integrations", icon: GitBranch, description: "GitHub, Slack, and more" },
];

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Configure your AIOS experience</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <GlassCard key={section.label} className="p-4" hover>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-elevation-3">
                  <Icon className="h-4.5 w-4.5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{section.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
