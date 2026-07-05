"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navigation, findNavItem } from "./navigation";

export function Sidebar() {
  const pathname = usePathname();
  const activeItem = findNavItem(pathname);

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[var(--sidebar-width)] flex-col border-r border-border bg-background">
      <div className="flex h-[var(--topbar-height)] items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-green">
          <span className="text-[11px] font-bold text-black">A</span>
        </div>
        <span className="text-sm font-semibold tracking-tight">AIOS</span>
        <span className="rounded bg-accent-green/10 px-1.5 py-0.5 text-[10px] font-medium text-accent-green">
          v0.1
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((section) => (
          <div key={section.label} className="mb-6">
            <span className="mb-2 block px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {section.label}
            </span>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-elevation-2",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg bg-elevation-2"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="relative z-10 h-4 w-4 shrink-0" />
                    <span className="relative z-10 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-green/10 px-1.5 text-[10px] font-medium text-accent-green">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-elevation-3 text-[11px] font-medium text-muted-foreground">
            E
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium">Engineer</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-green shadow-[0_0_6px_rgba(34,211,160,0.5)]" />
              Active
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
