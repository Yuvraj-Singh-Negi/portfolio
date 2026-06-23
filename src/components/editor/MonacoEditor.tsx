"use client";

import { useRef, useEffect, useState } from "react";
import { useUIStore } from "@/stores/ui-store";

interface MonacoEditorProps {
  path: string;
  value: string;
  language: string;
  onChange?: (value: string) => void;
}

type Monaco = typeof import("monaco-editor");
type EditorInstance = import("monaco-editor").editor.IStandaloneCodeEditor;

export function MonacoEditor({
  path: _path,
  value,
  language,
  onChange,
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorInstance | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const onChangeRef = useRef(onChange);
  const [isReady, setIsReady] = useState(false);
  const fontSize = useUIStore((s) => s.fontSize);

  onChangeRef.current = onChange;

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const monaco = await import("monaco-editor");
        if (!mounted || !containerRef.current) return;

        monacoRef.current = monaco;

        monaco.editor.defineTheme("opencode-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "comment", foreground: "6A9955", fontStyle: "italic" },
            { token: "keyword", foreground: "C586C0" },
            { token: "string", foreground: "CE9178" },
            { token: "number", foreground: "B5CEA8" },
            { token: "type", foreground: "4EC9B0" },
            { token: "function", foreground: "DCDCAA" },
            { token: "variable", foreground: "9CDCFE" },
          ],
          colors: {
            "editor.background": "#050505",
            "editor.foreground": "#D4D4D4",
            "editor.lineHighlightBackground": "#1A1A1A",
            "editor.selectionBackground": "#264F78",
            "editor.inactiveSelectionBackground": "#3A3D41",
            "editorCursor.foreground": "#7DD3FC",
            "editorLineNumber.foreground": "#6B7280",
            "editorLineNumber.activeForeground": "#D4D4D4",
            "editor.selectionHighlightBackground": "#264F7840",
            "editorBracketMatch.background": "#264F7840",
            "editorBracketMatch.border": "#264F78",
            "editorGutter.background": "#050505",
            "editorWidget.background": "#1A1A1A",
            "editorWidget.border": "#27272A",
            "input.background": "#0A0A0A",
            "input.border": "#27272A",
            "focusBorder": "#27272A",
            "list.activeSelectionBackground": "#264F78",
            "list.hoverBackground": "#1A1A1A",
          },
        });

        const editor = monaco.editor.create(containerRef.current, {
          value,
          language,
          theme: "opencode-dark",
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize,
          fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
          lineNumbers: "on",
          renderWhitespace: "selection",
          tabSize: 2,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          padding: { top: 12, bottom: 12 },
          bracketPairColorization: { enabled: true },
        });

        editorRef.current = editor;
        setIsReady(true);

        editor.onDidChangeModelContent(() => {
          const currentValue = editor.getValue();
          onChangeRef.current?.(currentValue);
        });
      } catch {
        // Monaco failed to load
      }
    }

    init();

    return () => {
      mounted = false;
      editorRef.current?.dispose();
      editorRef.current = null;
      setIsReady(false);
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && isReady) {
      const currentValue = editor.getValue();
      if (currentValue !== value) {
        editor.setValue(value);
      }
    }
  }, [value, isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && isReady) {
      const model = editor.getModel();
      if (model) {
        monacoRef.current?.editor.setModelLanguage(model, language);
      }
    }
  }, [language, isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && isReady) {
      editor.updateOptions({ fontSize });
    }
  }, [fontSize, isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isReady) {
    return (
      <div className="flex h-full items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-400" />
          <span className="text-xs text-zinc-600">Loading editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full" />
  );
}
