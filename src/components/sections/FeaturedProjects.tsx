"use client";

import { projects } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/sections/ProjectCard";

export function FeaturedProjects() {
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
