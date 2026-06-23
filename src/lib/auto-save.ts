import { useWorkspaceStore } from "@/stores/workspace-store";

const SAVE_INTERVAL = 10000;
const SAVE_DEBOUNCE = 250;

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let lastSaveSnapshot = "";

function getVFSHash(vfs: Record<string, string>): string {
  return JSON.stringify(vfs);
}

export async function persistWorkspaceToServer(
  projectId: string,
  vfs: Record<string, string>
): Promise<boolean> {
  try {
    const res = await fetch(`/api/v1/projects/${projectId}/versions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ snapshot: { files: vfs, timestamp: Date.now() } }),
    });
    if (!res.ok) throw new Error("Failed to persist workspace");
    useWorkspaceStore.getState().markSaved();
    return true;
  } catch {
    return false;
  }
}

export function startAutoSave(projectId: string) {
  stopAutoSave();

  saveTimer = setInterval(() => {
    const { vfs } = useWorkspaceStore.getState();
    const hash = getVFSHash(vfs);
    if (hash !== lastSaveSnapshot) {
      lastSaveSnapshot = hash;
      persistWorkspaceToServer(projectId, vfs);
    }
  }, SAVE_INTERVAL);
}

export function stopAutoSave() {
  if (saveTimer) {
    clearInterval(saveTimer);
    saveTimer = null;
  }
}

export function debouncedSave(callback: () => void) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(callback, SAVE_DEBOUNCE);
}

export function saveBeforeNavigation(projectId: string): boolean {
  const { vfs, hasUnsavedChanges } = useWorkspaceStore.getState();
  if (hasUnsavedChanges()) {
    const hash = getVFSHash(vfs);
    if (hash !== lastSaveSnapshot) {
      lastSaveSnapshot = hash;
      persistWorkspaceToServer(projectId, vfs);
    }
  }
  return true;
}

export function setupBeforeUnload(projectId: string) {
  const handler = () => {
    saveBeforeNavigation(projectId);
  };
  window.addEventListener("beforeunload", handler);
  return () => window.removeEventListener("beforeunload", handler);
}
