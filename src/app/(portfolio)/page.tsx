import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <FeaturedProjects />
        {/* Phase 5 sections mount here */}
      </main>
      <Footer />
    </>
  );
}
