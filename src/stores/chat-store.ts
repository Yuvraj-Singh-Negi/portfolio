import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

interface ChatState {
  messages: Message[];
  isGenerating: boolean;
  currentConversationId: string | null;
  addMessage: (msg: Omit<Message, "id" | "timestamp">) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  setIsGenerating: (v: boolean) => void;
  setConversationId: (id: string | null) => void;
  appendToLastAssistant: (content: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isGenerating: false,
      currentConversationId: null,

      addMessage: (msg) => {
        const id = crypto.randomUUID();
        set((s) => ({
          messages: [
            ...s.messages,
            { ...msg, id, timestamp: Date.now() },
          ],
        }));
      },

      setMessages: (messages) => set({ messages }),
      clearMessages: () => set({ messages: [] }),

      setIsGenerating: (isGenerating) => set({ isGenerating }),

      setConversationId: (currentConversationId) =>
        set({ currentConversationId }),

      appendToLastAssistant: (content) => {
        const msgs = get().messages;
        const lastIdx = msgs.length - 1;
        if (lastIdx >= 0 && msgs[lastIdx]?.role === "assistant") {
          const updated = [...msgs];
          updated[lastIdx] = {
            ...updated[lastIdx]!,
            content: updated[lastIdx]!.content + content,
          };
          set({ messages: updated });
        }
      },
    }),
    {
      name: "opencode-chat",
      partialize: (state) => ({
        messages: state.messages,
        currentConversationId: state.currentConversationId,
      }),
    }
  )
);
