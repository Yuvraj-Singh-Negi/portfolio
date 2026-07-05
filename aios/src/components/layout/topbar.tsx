"use client";

import { useState } from "react";
import { Search, Bell, Command, Bot, GitBranch, Target, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./command-palette";

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      <header
        className="fixed right-0 top-0 z-20 flex h-[var(--topbar-height)] items-center gap-3 border-b border-border bg-background px-4"
        style={{ left: "var(--sidebar-width)" }}
      >
        <div className="flex-1">
          {title && <h1 className="text-sm font-semibold tracking-tight">{title}</h1>}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-elevation-1 px-2.5 py-1">
            <Bot className="h-3.5 w-3.5 text-accent-purple" />
            <span className="text-[11px] font-medium text-muted-foreground">AI Ready</span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green shadow-[0_0_6px_rgba(34,211,160,0.5)]" />
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-elevation-1 px-2.5 py-1">
            <GitBranch className="h-3.5 w-3.5 text-accent-blue" />
            <span className="text-[11px] font-medium text-muted-foreground">main</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-elevation-1 px-2.5 py-1">
            <Target className="h-3.5 w-3.5 text-accent-amber" />
            <span className="text-[11px] font-medium text-muted-foreground">3 tasks</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPaletteOpen(true)}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-border bg-elevation-1 px-3 py-1.5",
              "text-sm text-muted-foreground transition-colors hover:text-foreground hover:border-border-light",
              "w-56",
            )}
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 text-left text-xs">Search anything...</span>
            <kbd className="flex items-center gap-0.5 rounded border border-border bg-elevation-2 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-elevation-2"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-elevation-2">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-green shadow-[0_0_6px_rgba(34,211,160,0.5)]" />
          </button>
        </div>
      </header>

      {paletteOpen && <CommandPalette />}
    </>
  );
}
