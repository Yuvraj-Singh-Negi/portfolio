"use client";

import { cn } from "@/lib/utils";

type Stage = "analyze" | "generate" | "build" | "deploy";

interface GenerationProgressProps {
  currentStage?: Stage;
  className?: string;
}

const STAGES: Array<{
  id: Stage;
  label: string;
  description: string;
}> = [
  { id: "analyze", label: "Analyze", description: "Understanding your request" },
  { id: "generate", label: "Generate", description: "Writing code" },
  { id: "build", label: "Build", description: "Compiling project" },
  { id: "deploy", label: "Deploy", description: "Releasing to production" },
];

const STAGE_INDEX: Record<Stage, number> = {
  analyze: 0,
  generate: 1,
  build: 2,
  deploy: 3,
};

export function GenerationProgress({
  currentStage,
  className,
}: GenerationProgressProps) {
  const currentIdx = currentStage ? STAGE_INDEX[currentStage] : -1;

  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-zinc-800 px-4 py-2",
        className
      )}
    >
      {STAGES.map((stage, i) => {
        const isActive = i === currentIdx;
        const isComplete = i < currentIdx;
        const isPending = i > currentIdx;

        return (
          <div key={stage.id} className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium transition-colors",
                isActive && "bg-[#7DD3FC] text-black",
                isComplete && "bg-emerald-500/20 text-emerald-400",
                isPending && "bg-zinc-800 text-zinc-600"
              )}
            >
              {isComplete ? (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-[11px] font-medium leading-tight",
                  isActive && "text-[#7DD3FC]",
                  isComplete && "text-emerald-400",
                  isPending && "text-zinc-600"
                )}
              >
                {stage.label}
              </span>
              <span className="text-[9px] leading-tight text-zinc-700">
                {stage.description}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-px w-4",
                  i < currentIdx ? "bg-emerald-500/30" : "bg-zinc-800"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
