"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { fadeUp, defaultTransition } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectPlaceholder({ title, index }: { title: string; index: number }) {
  const initials = title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex aspect-[16/10] items-center justify-center bg-zinc-900/50">
      <span className="select-none text-5xl font-bold tracking-tighter text-zinc-800">
        {initials || `P${index + 1}`}
      </span>
    </div>
  );
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <motion.article
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-[#111111] transition-colors hover:border-zinc-700/50"
      variants={fadeUp}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{ ...defaultTransition, delay: index * 0.1 }}
    >
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`${project.title} — opens in new tab`}
      >
        <div className="overflow-hidden">
          <div className="transition-transform duration-700 ease-out group-hover:scale-105">
            <ProjectPlaceholder title={project.title} index={index} />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
              {project.title}
            </h3>
            <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-300" />
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-full bg-zinc-800/50 px-2.5 py-0.5 text-xs text-zinc-500"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </a>
    </motion.article>
  );
}
