"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { socialLinks } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export function Social() {
  return (
    <section className="pb-16 sm:pb-24" aria-label="Social links">
      <Container>
        <div className="flex items-center justify-center gap-4">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.icon as keyof typeof iconMap];
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.06] text-zinc-600 transition-all duration-300 hover:border-white/[0.15] hover:text-zinc-300 hover:bg-white/[0.03] hover:shadow-[0_0_24px_rgba(255,255,255,0.03)]"
                aria-label={link.label}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
