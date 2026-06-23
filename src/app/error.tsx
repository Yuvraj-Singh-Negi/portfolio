"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { WolfMascot } from "@/components/brand/WolfMascot";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 bg-[#050505] px-4">
      <WolfMascot size={80} animate={false} glowIntensity="medium" />
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-lg font-semibold text-zinc-300">
          Something went wrong
        </h1>
        <p className="max-w-md text-center text-sm text-zinc-600">
          {error.message || "An unexpected error occurred."}
        </p>
      </div>
      <button
        onClick={reset}
        className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
      >
        Try Again
      </button>
    </div>
  );
}
