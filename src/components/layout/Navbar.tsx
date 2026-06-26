"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, personalInfo } from "@/data/portfolio";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function useActiveSection() {
  const [active, setActive] = useState("");
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const visible = new Map<string, boolean>();
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      visible.set(id, false);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry) {
            visible.set(id, entry.isIntersecting);
            if (entry.isIntersecting) {
              setActive(id);
            } else if (id === activeRef.current) {
              const stillVisible = [...visible.entries()].some(([, v]) => v);
              if (!stillVisible) setActive("");
            }
          }
        },
        { threshold: 0.2, rootMargin: "-80px 0px 0px 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return active;
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isScrolled } = useScrollPosition();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const activeSection = useActiveSection();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.04]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10"
          aria-label="Main navigation"
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="font-display text-sm font-semibold tracking-tight text-zinc-300 transition-colors hover:text-zinc-100"
            aria-label="Go to top"
          >
            {personalInfo.name}
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className={`relative py-1 text-small transition-colors duration-300 ${
                  activeSection === link.href.replace("#", "")
                    ? "text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                aria-current={activeSection === link.href.replace("#", "") ? "true" : undefined}
              >
                {link.label}
                {activeSection === link.href.replace("#", "") && (
                  <span className="absolute -bottom-px left-0 right-0 h-px bg-zinc-400" />
                )}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "#contact")}
              className="inline-flex h-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-small text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              Let&apos;s Talk
            </a>
          </div>

          <button
            className="relative z-50 flex h-8 w-8 items-center justify-center md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-4 w-4 text-zinc-300" /> : <Menu className="h-4 w-4 text-zinc-300" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#050505]/95 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col items-center gap-8" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className={`text-2xl tracking-tight transition-colors ${
                    activeSection === link.href.replace("#", "")
                      ? "text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-8 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
              >
                Let&apos;s Talk
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
