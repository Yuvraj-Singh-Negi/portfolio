import type { Variants, Transition } from "framer-motion";

export const easeOutExpo: Transition = {
  duration: 0.8,
  ease: [0.19, 1, 0.22, 1],
};

export const easeInOut: Transition = {
  duration: 0.6,
  ease: [0.76, 0, 0.24, 1],
};

export const spring: Transition = {
  type: "spring",
  stiffness: 250,
  damping: 25,
  mass: 1,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 20,
  mass: 1,
};

export const slow: Transition = {
  duration: 1.2,
  ease: [0.19, 1, 0.22, 1],
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const fadeUpScale: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(4px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

export const staggerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -6 },
};

export const cardTap = {
  tap: { scale: 0.98 },
};

export const linkUnderline: Variants = {
  rest: { scaleX: 0, originX: 0 },
  hover: { scaleX: 1, originX: 0 },
};

export const navReveal: Variants = {
  hidden: { y: -20, opacity: 0, filter: "blur(4px)" },
  visible: (i: number = 0) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.1, ...easeOutExpo },
  }),
};
