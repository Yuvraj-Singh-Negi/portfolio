"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { staggerContainer } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function FeaturedProjects() {
  const { ref, isVisible } = useScrollAnimation();

  const sorted = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return Number(b.year) - Number(a.year);
  });

  return (
    <section id="work" className="py-32" aria-label="Projects">
      <Container>
        <SectionHeading
          title="Projects"
          subtitle="Production-grade applications built with modern technologies."
        />
      </Container>

      <Container>
        <motion.div
          ref={ref}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {sorted.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
