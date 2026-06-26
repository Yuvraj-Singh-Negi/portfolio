import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Skills />
        {/* Phase 4-5 sections mount here */}
      </main>
      <Footer />
    </>
  );
}
