import { create } from "zustand";
import type { ChatMessage, ChatSession } from "./types";
import type { AIMode } from "@/lib/ai/types";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface AIStore {
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeTab: "chat" | "code-review" | "architecture" | "research";

  setActiveTab: (tab: AIStore["activeTab"]) => void;
  createSession: (mode: AIMode) => string;
  deleteSession: (id: string) => void;
  selectSession: (id: string | null) => void;
  addMessage: (
    sessionId: string,
    role: "user" | "assistant",
    content: string,
    mode: AIMode,
  ) => void;
  getActiveSession: () => ChatSession | undefined;
  getSessionsByMode: (mode: AIMode) => ChatSession[];
}

export const useAIStore = create<AIStore>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  activeTab: "chat",

  setActiveTab: (tab) => set({ activeTab: tab }),

  createSession: (mode) => {
    const id = generateId();
    const session: ChatSession = {
      id,
      title: `New ${mode} session`,
      messages: [],
      mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ sessions: [...state.sessions, session], activeSessionId: id }));
    return id;
  },

  deleteSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
    })),

  selectSession: (id) => set({ activeSessionId: id }),

  addMessage: (sessionId, role, content, mode) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              title: s.messages.length === 0 ? content.slice(0, 60) : s.title,
              messages: [
                ...s.messages,
                { id: generateId(), role, content, mode, timestamp: new Date().toISOString() },
              ],
              updatedAt: new Date().toISOString(),
            }
          : s,
      ),
    })),

  getActiveSession: () => {
    const { sessions, activeSessionId } = get();
    return sessions.find((s) => s.id === activeSessionId);
  },

  getSessionsByMode: (mode) => {
    return get().sessions.filter((s) => s.mode === mode);
  },
}));
