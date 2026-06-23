"use client";

import { useEffect, useRef } from "react";
import { startAutoSave, stopAutoSave, setupBeforeUnload } from "@/lib/auto-save";

export function useAutoSave(projectId: string | null) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!projectId) return;

    startAutoSave(projectId);
    cleanupRef.current = setupBeforeUnload(projectId);

    return () => {
      stopAutoSave();
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [projectId]);
}
