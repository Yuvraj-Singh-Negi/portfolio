"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/ui/TextReveal";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { staggerContainer, defaultTransition } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function FeaturedProjects() {
  const { ref, isVisible } = useScrollAnimation();
  const sorted = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <section id="projects" className="py-32" aria-label="Projects">
      <Container>
        <TextReveal
          as="h2"
          className="text-section mb-4 text-zinc-100"
          delay={0.1}
        >
          Projects
        </TextReveal>
        <TextReveal
          as="p"
          className="mb-16 max-w-md text-zinc-500"
          delay={0.2}
        >
          Production-grade applications built with modern technologies.
        </TextReveal>
      </Container>

      <Container>
        <motion.div
          ref={ref}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          transition={defaultTransition}
        >
          {sorted.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
