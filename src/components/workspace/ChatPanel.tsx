"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/stores/chat-store";
import { Send, Loader2 } from "lucide-react";

export function ChatPanel() {
  const { messages, addMessage, isGenerating, setIsGenerating } = useChatStore();
  const [input, setInput] = useState("");
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isGenerating) return;

    addMessage({ role: "user", content: trimmed });
    setInput("");
    setIsGenerating(true);

    try {
      // Placeholder: Will integrate with AI generation in production
      addMessage({
        role: "assistant",
        content: "I'll analyze your request and generate the code.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startEditing = (index: number, content: string) => {
    setEditingMessageIndex(index);
    setEditContent(content);
  };

  const saveEdit = (index: number) => {
    if (editContent.trim()) {
      useChatStore.setState((s) => {
        const updated = [...s.messages];
        updated[index] = { ...updated[index]!, content: editContent.trim() };
        return { messages: updated };
      });
    }
    setEditingMessageIndex(null);
    setEditContent("");
  };

  return (
    <div className="flex h-full flex-col bg-[#050505]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="text-sm text-zinc-600">Start a conversation</p>
            <p className="text-xs text-zinc-700">
              Describe what you want to build
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={msg.id} className="group" data-message-id={msg.id}>
              <div
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-zinc-800 text-zinc-200"
                      : "bg-zinc-900 text-zinc-300"
                  }`}
                  role="article"
                  aria-label={msg.role === "user" ? "Your message" : "Assistant response"}
                >
                  {editingMessageIndex === i ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[60px] w-full resize-none bg-transparent text-sm text-zinc-200 focus:outline-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveEdit(i)}
                          className="rounded bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300 hover:bg-zinc-600"
                          aria-label="Save edited message"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingMessageIndex(null)}
                          className="rounded px-2 py-0.5 text-xs text-zinc-500 hover:text-zinc-400"
                          aria-label="Cancel editing"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  )}
                </div>
              </div>
              {msg.role === "user" && editingMessageIndex !== i && (
                <div className="mt-1 flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => startEditing(i, msg.content)}
                    className="text-[10px] text-zinc-600 hover:text-zinc-400"
                    aria-label="Edit message"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-3">
        <div className="flex items-end gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            rows={1}
            className="max-h-32 flex-1 resize-none bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50"
            aria-label="Message input"
            aria-describedby={isGenerating ? "generating-status" : undefined}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-zinc-700"
            aria-label={isGenerating ? "Generating response..." : "Send message"}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          {isGenerating && (
            <span id="generating-status" className="sr-only">
              Generating response
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
