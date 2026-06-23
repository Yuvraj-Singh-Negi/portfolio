"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { WolfMascot } from "@/components/brand/WolfMascot";

export default function GlobalError({
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
    <html>
      <body className="bg-[#050505] text-zinc-100">
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
          <WolfMascot size={100} animate={false} glowIntensity="medium" />
          <div className="flex flex-col items-center gap-2">
            <div className="text-6xl font-bold tracking-tighter text-zinc-800">
              500
            </div>
            <h1 className="text-lg font-semibold text-zinc-300">
              Internal Error
            </h1>
            <p className="max-w-md text-center text-sm text-zinc-600">
              An unexpected error occurred. Our team has been notified.
            </p>
          </div>
          <button
            onClick={reset}
            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
