import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-dvh bg-[#050505]">
        {/* Phase 3-5 sections will mount here */}
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 pt-16">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-zinc-700" />
              <span className="text-tiny tracking-widest text-zinc-700 uppercase">
                Phase 2 Active
              </span>
            </div>
            <h1 className="text-display text-zinc-100">
              Yuvraj Singh Negi
            </h1>
            <p className="text-subtitle text-zinc-500">
              Navbar, Footer, Animation Engine, Primitives — Ready
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
