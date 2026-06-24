"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./ChatPanel";
import { EditorPanel } from "../editor/EditorPanel";
import { GenerationProgress } from "./GenerationProgress";

export function WorkspaceLayout() {
  const [chatWidth, setChatWidth] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const percentage = ((e.clientX - rect.left) / rect.width) * 100;
      setChatWidth(Math.max(20, Math.min(50, percentage)));
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="flex h-screen w-screen overflow-hidden bg-[#050505]"
      role="application"
      aria-label="Workspace"
    >
      {/* Chat Panel */}
      <aside
        className="flex h-full flex-shrink-0 flex-col overflow-hidden border-r border-zinc-800"
        style={{ width: `${chatWidth}%` }}
        aria-label="Chat panel"
      >
        <GenerationProgress />
        <ChatPanel />
      </aside>

      {/* Resize Handle */}
      <div
        className={cn(
          "relative z-10 w-1 cursor-col-resize transition-colors hover:bg-[#7DD3FC]/30",
          isDragging && "bg-[#7DD3FC]/50"
        )}
        onMouseDown={handleMouseDown}
        role="separator"
        tabIndex={0}
        aria-orientation="vertical"
        aria-label="Resize chat panel"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            setChatWidth(Math.max(20, chatWidth - 2));
          } else if (e.key === 'ArrowRight') {
            setChatWidth(Math.min(50, chatWidth + 2));
          }
        }}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>

      {/* Editor Panel */}
      <main className="flex h-full flex-1 flex-col overflow-hidden" aria-label="Editor panel">
        <EditorPanel />
      </main>
    </div>
  );
}
