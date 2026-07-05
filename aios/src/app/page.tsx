"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-green">
          <span className="text-lg font-bold text-black">A</span>
        </div>
        <div className="flex gap-1">
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-green"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-green"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent-green"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
