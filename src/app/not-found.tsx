import Link from "next/link";
import { WolfMascot } from "@/components/brand/WolfMascot";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#050505] px-4">
      <WolfMascot size={80} animate={false} glowIntensity="low" />
      <div className="flex flex-col items-center gap-2">
        <div className="text-6xl font-bold tracking-tighter text-zinc-800">
          404
        </div>
        <h1 className="text-lg font-semibold text-zinc-300">
          Page not found
        </h1>
        <p className="max-w-md text-center text-sm text-zinc-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
      >
        Go Home
      </Link>
    </div>
  );
}
