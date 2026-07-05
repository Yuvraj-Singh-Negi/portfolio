"use client";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <p className="text-sm text-accent-red">Something went wrong</p>
      <p className="max-w-md text-center text-xs text-muted-foreground">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-accent-blue/10"
      >
        Try again
      </button>
    </div>
  );
}
