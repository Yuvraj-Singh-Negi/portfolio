"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { personalInfo } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const socialLinks = [
  {
    label: "GitHub",
    href: personalInfo.github,
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: `https://linkedin.com/in/${personalInfo.linkedin.replace(/\s+/g, "")}`,
    icon: Linkedin,
  },
  {
    label: "Email",
    href: `mailto:${personalInfo.email}`,
    icon: Mail,
  },
];

export function Social() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="pb-16" aria-label="Social links">
      <Container>
        <motion.div
          ref={ref}
          className="flex items-center justify-center gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition-all hover:border-zinc-600 hover:text-zinc-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.04)]"
                variants={fadeUp}
                transition={defaultTransition}
                aria-label={link.label}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
