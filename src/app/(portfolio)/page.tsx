import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";

const Experience = dynamic(
  () => import("@/components/sections/Experience").then((m) => m.Experience),
  { loading: () => <div className="h-screen" aria-hidden="true" /> }
);

const Contact = dynamic(
  () => import("@/components/sections/Contact").then((m) => m.Contact),
  { loading: () => <div className="h-screen" aria-hidden="true" /> }
);

const Social = dynamic(
  () => import("@/components/sections/Social").then((m) => m.Social),
  { loading: () => null }
);

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
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
