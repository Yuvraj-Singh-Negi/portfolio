"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { PageTransition } from "@/components/effects/page-transition";
import { NeuralNetwork } from "@/components/effects/neural-network";
import { BootSequence } from "@/components/effects/boot-sequence";

interface ShellProps {
  children: ReactNode;
  title?: string;
}

export function Shell({ children, title }: ShellProps) {
  const [showBoot, setShowBoot] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("aios-booted");
  });
  const pathname = usePathname();

  const handleBootComplete = () => {
    sessionStorage.setItem("aios-booted", "true");
    setShowBoot(false);
  };

  return (
    <>
      {showBoot && <BootSequence onComplete={handleBootComplete} />}

      <NeuralNetwork />

      <div className="flex h-screen relative z-10">
        <Sidebar />
        <div className="ml-[var(--sidebar-width)] flex flex-1 flex-col">
          <Topbar title={title} />
          <main className="flex-1 overflow-y-auto pt-[var(--topbar-height)]">
            <PageTransition key={pathname}>{children}</PageTransition>
          </main>
        </div>
      </div>
    </>
  );
}
