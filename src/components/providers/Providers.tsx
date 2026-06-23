"use client";

import { ThemeProvider } from "./ThemeProvider";
import { PostHogProvider } from "./PostHogProvider";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <ThemeProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0a0a0a",
              color: "#e4e4e7",
              border: "1px solid #27272a",
              borderRadius: "8px",
              fontSize: "14px",
            },
          }}
        />
      </ThemeProvider>
    </PostHogProvider>
  );
}
