"use client";

import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/portfolio";
import { ProjectPlaceholder } from "@/components/sections/ProjectPlaceholder";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useRef, useState } from "react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

function getOgImageUrl(liveUrl: string): string {
  const base = liveUrl.replace(/\/$/, "");
  return `${base}/api/og`;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const delay = Math.min(index * 1 + 1, 5);
  const ref = useScrollReveal({ delay });
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    const url = getOgImageUrl(project.liveUrl);
    const img = new Image();
    img.onload = () => setImgSrc(url);
    img.onerror = () => setImgError(true);
    img.src = url;
  }, [project.liveUrl]);

  return (
    <div ref={ref} className={`reveal reveal-delay-${delay}`}>
      <article className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.02)] hover:-translate-y-1">
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          aria-label={`${project.title} — opens in new tab`}
        >
          <div className="overflow-hidden">
            <div className="origin-center transition-transform duration-700 ease-out group-hover:scale-105">
              {imgError || !imgSrc ? (
                <ProjectPlaceholder title={project.title} index={index} />
              ) : (
                <img
                  src={imgSrc}
                  alt={`Screenshot of ${project.title}`}
                  className="aspect-[16/10] w-full object-cover"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

          <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-[#0a0a0a]/80 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:border-white/[0.15]">
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
          </div>

          <div className="relative z-10 space-y-3 p-5">
            <h3 className="font-serif text-base font-semibold tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-zinc-50">
              {project.title}
            </h3>
            <p className="line-clamp-2 text-small leading-relaxed text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-full border border-white/[0.04] bg-white/[0.02] px-2.5 py-0.5 text-xs text-zinc-600 transition-colors duration-300 group-hover:border-white/[0.08] group-hover:text-zinc-500"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-700/50 scale-x-0 transition-transform duration-500 ease-out origin-left group-hover:scale-x-100" />
        </a>
      </article>
    </div>
  );
}
