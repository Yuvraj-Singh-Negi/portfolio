"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { navigation, type NavItem } from "./navigation";
import {
  Search,
  Command,
  Plus,
  FileText,
  ExternalLink,
  ArrowRight,
  Sparkles,
  History,
} from "lucide-react";

const quickActions = [
  { label: "New Project", icon: Plus, action: "project" },
  { label: "New Note", icon: FileText, action: "note" },
  { label: "Ask AI Mentor", icon: Sparkles, action: "mentor" },
];

const recentItems = [
  { label: "System Design: Distributed Systems", href: "/learning" },
  { label: "API Gateway Project", href: "/projects" },
  { label: "Rust Ownership Model", href: "/knowledge" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allNavItems: (NavItem & { section: string })[] = [];
  for (const section of navigation) {
    for (const item of section.items) {
      allNavItems.push({ ...item, section: section.label });
    }
  }

  const filtered = query
    ? allNavItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.href.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const allResults = query ? filtered : [];

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        setQuery("");
        setSelectedIndex(0);
      }, 50);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const results = query ? allNavItems : quickActions;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const results = query ? allNavItems : quickActions;
      const selected = results[selectedIndex];
      if (selected) {
        if ("href" in selected) {
          navigate(selected.href);
        } else if ("action" in selected) {
          if (selected.action === "mentor") navigate("/mentor");
          else if (selected.action === "project") navigate("/projects");
          else if (selected.action === "note") navigate("/notes");
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-[15%] w-full max-w-lg -translate-x-1/2 rounded-xl border border-border bg-elevation-2 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search anything, navigate, or run a command..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="flex items-center gap-0.5 rounded border border-border bg-elevation-3 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {!query && (
                <>
                  <div className="px-2 py-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Quick Actions
                    </span>
                  </div>
                  {quickActions.map((action, i) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.action}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          selectedIndex === i
                            ? "bg-accent-green/10 text-accent-green"
                            : "text-muted-foreground hover:text-foreground hover:bg-elevation-3",
                        )}
                        onClick={() => {
                          if (action.action === "mentor") navigate("/mentor");
                          else if (action.action === "project") navigate("/projects");
                          else if (action.action === "note") navigate("/notes");
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {action.label}
                        <kbd className="ml-auto text-[10px] text-muted-foreground">
                          {action.action === "project"
                            ? "⌘P"
                            : action.action === "note"
                              ? "⌘N"
                              : "⌘M"}
                        </kbd>
                      </button>
                    );
                  })}

                  <div className="mt-2 border-t border-border pt-2">
                    <div className="px-2 py-1.5">
                      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        <History className="h-3 w-3" />
                        Recent
                      </span>
                    </div>
                    {recentItems.map((item) => (
                      <button
                        key={item.href}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-elevation-3 transition-colors"
                        onClick={() => navigate(item.href)}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {query && filtered.length === 0 && (
                <div className="flex flex-col items-center py-8 text-center">
                  <Search className="mb-2 h-6 w-6 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    Try a different search term
                  </p>
                </div>
              )}

              {query && filtered.length > 0 && (
                <div>
                  <div className="px-2 py-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Navigation
                    </span>
                  </div>
                  {filtered.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          selectedIndex === i
                            ? "bg-accent-green/10 text-accent-green"
                            : "text-muted-foreground hover:text-foreground hover:bg-elevation-3",
                        )}
                        onClick={() => navigate(item.href)}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="flex-1 text-left">
                          <span>{item.label}</span>
                          <span className="ml-2 text-[10px] text-muted-foreground">
                            {item.section}
                          </span>
                        </div>
                        <kbd className="text-[10px] text-muted-foreground">{item.badge}</kbd>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-border px-4 py-2">
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border px-1">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border px-1">↵</kbd>
                  Open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border px-1">Esc</kbd>
                  Close
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
