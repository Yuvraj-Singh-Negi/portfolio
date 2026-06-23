"use client";

import { WolfMascot } from "./WolfMascot";
import { cn } from "@/lib/utils";

type LoaderState = "idle" | "loading" | "generating" | "building" | "deploying" | "error";

interface WolfLoaderProps {
  state?: LoaderState;
  message?: string;
  className?: string;
  size?: number;
}

const STATE_MESSAGES: Record<LoaderState, string> = {
  idle: "Ready",
  loading: "Loading...",
  generating: "Analyzing request...",
  building: "Compiling project...",
  deploying: "Deploying to production...",
  error: "Something went wrong",
};

const STATE_GLOW: Record<LoaderState, "low" | "medium" | "high"> = {
  idle: "low",
  loading: "medium",
  generating: "high",
  building: "high",
  deploying: "high",
  error: "high",
};

export function WolfLoader({
  state = "idle",
  message,
  className,
  size = 80,
}: WolfLoaderProps) {
  const glow = STATE_GLOW[state];
  const displayMessage = message ?? STATE_MESSAGES[state];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <div
        className={cn(
          "relative transition-transform duration-500",
          state === "error" && "animate-pulse"
        )}
      >
        <WolfMascot
          size={size}
          animate={state !== "idle"}
          glowIntensity={glow}
        />

        {/* Scanning ring animation for active states */}
        {(state === "generating" || state === "building" || state === "deploying") && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[calc(100%+16px)] w-[calc(100%+16px)] animate-spin rounded-full border border-[#7DD3FC]/20 border-t-[#7DD3FC]/60" style={{ animationDuration: "3s" }} />
          </div>
        )}

        {/* Pulsing ring for loading */}
        {state === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[calc(100%+12px)] w-[calc(100%+12px)] animate-ping rounded-full border border-[#7DD3FC]/30" style={{ animationDuration: "2s" }} />
          </div>
        )}

        {/* Error ring */}
        {state === "error" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[calc(100%+12px)] w-[calc(100%+12px)] rounded-full border border-red-500/40" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        <p
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            state === "error"
              ? "text-red-400"
              : state !== "idle"
                ? "text-zinc-300"
                : "text-zinc-500"
          )}
        >
          {displayMessage}
        </p>

        {/* Progress dots for active states */}
        {(state === "generating" || state === "building" || state === "deploying") && (
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#7DD3FC]"
                style={{
                  animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                  opacity: 0.4,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
