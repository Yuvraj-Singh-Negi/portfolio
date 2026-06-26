"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/portfolio";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { navReveal, staggerFast, easeOutExpo } from "@/lib/animations";

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActive(id);
        },
        { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return active;
}

function NavLink({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`relative py-1 text-small transition-colors duration-300 ${
        isActive ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
      }`}
      aria-current={isActive ? "true" : undefined}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute -bottom-px left-0 right-0 h-px bg-zinc-400"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </a>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isScrolled } = useScrollPosition();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
  const activeSection = useActiveSection(sectionIds);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.04]"
            : "bg-transparent border-b border-transparent"
        }`}
        variants={staggerFast}
        initial="hidden"
        animate="visible"
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10"
          aria-label="Main navigation"
        >
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-sm font-medium tracking-tight text-zinc-300 transition-colors hover:text-zinc-100"
            variants={navReveal}
            custom={0}
            aria-label="Go to top"
          >
            YSN
          </motion.a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link, i) => (
              <motion.div key={link.href} variants={navReveal} custom={i + 1}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  isActive={activeSection === link.href.replace("#", "")}
                  onClick={(e) => handleScroll(e, link.href)}
                />
              </motion.div>
            ))}
            <motion.div variants={navReveal} custom={navLinks.length + 1}>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
                className="inline-flex h-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-small text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
              >
                Let&apos;s Talk
              </a>
            </motion.div>
          </div>

          <motion.button
            className="relative z-50 flex h-8 w-8 items-center justify-center md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            variants={navReveal}
            custom={0}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4 text-zinc-300" /> : <Menu className="h-4 w-4 text-zinc-300" />}
          </motion.button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#050505]/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={easeOutExpo}
          >
            <nav className="flex flex-col items-center gap-8" aria-label="Mobile navigation">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className={`text-2xl tracking-tight transition-colors ${
                    activeSection === link.href.replace("#", "")
                      ? "text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, ...easeOutExpo }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-8 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ...easeOutExpo }}
              >
                Let&apos;s Talk
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
