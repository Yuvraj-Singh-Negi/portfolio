"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { socialLinks } from "@/data/portfolio";
import { Container } from "@/components/layout/Container";
import { fadeUp, staggerFast, easeOutExpo } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export function Social() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="pb-24" aria-label="Social links">
      <Container>
        <motion.div
          ref={ref}
          className="flex items-center justify-center gap-4"
          variants={staggerFast}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {socialLinks.map((link) => {
            const Icon = iconMap[link.icon as keyof typeof iconMap];
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.06] text-zinc-600 transition-all duration-300 hover:border-white/[0.15] hover:text-zinc-300 hover:bg-white/[0.03] hover:shadow-[0_0_24px_rgba(255,255,255,0.03)]"
                variants={fadeUp}
                transition={easeOutExpo}
                aria-label={link.label}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
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
