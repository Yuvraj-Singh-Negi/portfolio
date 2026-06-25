"use client";

import { motion } from "framer-motion";
import { navLinks } from "@/data/portfolio";
import { fadeIn, defaultTransition } from "@/lib/animations";

export function Navbar() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ ...defaultTransition, delay: 0.5 }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <a
          href="#"
          className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          YSN
        </a>
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={(e) => handleClick(e, "#contact")}
              className="inline-flex h-8 items-center justify-center rounded-full border border-zinc-800 px-4 text-sm text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
            >
              Let&apos;s Talk
            </a>
          </li>
        </ul>
      </nav>
    </motion.header>
  );
}
