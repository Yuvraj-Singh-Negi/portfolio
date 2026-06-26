import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Social } from "@/components/sections/Social";

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <FeaturedProjects />
        <Experience />
        <Contact />
        <Social />
      </main>
      <Footer />
    </>
  );
}
