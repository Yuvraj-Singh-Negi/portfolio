import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4">
      <div className="flex max-w-lg flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100">
            OpenCode
          </h1>
          <p className="text-sm text-zinc-500">
            Enterprise AI software generation platform.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/api/auth/signin"
            className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Sign In
          </Link>
          <Link
            href="/api/auth/signup"
            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-800 px-4 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-900"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
