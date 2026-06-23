"use client";

import dynamic from "next/dynamic";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { EditorErrorBoundary } from "./EditorErrorBoundary";
import { detectLanguage } from "@/types/vfs";
import { X } from "lucide-react";

const MonacoEditor = dynamic(
  () => import("./MonacoEditor").then((mod) => mod.MonacoEditor),
  { ssr: false }
);

export function EditorPanel() {
  const openTabs = useWorkspaceStore((s) => s.openTabs);
  const activeTab = useWorkspaceStore((s) => s.activeTab);
  const vfs = useWorkspaceStore((s) => s.vfs);
  const updateFile = useWorkspaceStore((s) => s.updateFile);
  const closeTab = useWorkspaceStore((s) => s.closeTab);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);

  if (openTabs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-zinc-600">No files open</p>
          <p className="text-xs text-zinc-700">
            Select a file from the explorer to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#050505]">
      <div className="flex items-center border-b border-zinc-800 bg-[#050505]">
        <div className="flex flex-1 overflow-x-auto">
          {openTabs.map((tabPath) => {
            const isActive = tabPath === activeTab;
            const fileName = tabPath.split("/").pop() ?? tabPath;
            return (
              <button
                key={tabPath}
                onClick={() => setActiveTab(tabPath)}
                onMouseDown={(e) => {
                  if (e.button === 1) closeTab(tabPath);
                }}
                className={`group flex items-center gap-1.5 border-r border-zinc-800 px-3 py-2 text-xs transition-colors ${
                  isActive
                    ? "bg-[#0A0A0A] text-zinc-100"
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                }`}
              >
                <span className="truncate max-w-[120px]">{fileName}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tabPath);
                  }}
                  className="ml-1 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <EditorErrorBoundary>
          {activeTab && vfs[activeTab] !== undefined && (
            <MonacoEditor
              key={activeTab}
              path={activeTab}
              value={vfs[activeTab]!}
              language={detectLanguage(activeTab)}
              onChange={(newValue) => {
                updateFile(activeTab, newValue);
              }}
            />
          )}
        </EditorErrorBoundary>
      </div>
    </div>
  );
}
