export default function PortfolioPage() {
  return (
    <main className="relative min-h-dvh bg-[#050505]">
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-zinc-700" />
            <span className="text-tiny tracking-widest text-zinc-700 uppercase">
              Phase 1 Complete
            </span>
          </div>
          <h1 className="text-display text-zinc-100">
            Yuvraj Singh Negi
          </h1>
          <p className="text-subtitle text-zinc-500">
            Full-Stack Developer
          </p>
        </div>
      </div>
    </main>
  );
}
