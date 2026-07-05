"use client";

import { motion } from "framer-motion";

export function WelcomeSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Welcome back, Engineer</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your command center is ready. <span className="text-accent-green">3 tasks</span> need
            your attention today.
          </p>
        </div>
        <motion.div
          className="flex items-center gap-2 rounded-lg border border-card-border bg-card px-4 py-2"
          whileHover={{ borderColor: "rgba(34,211,160,0.3)" }}
        >
          <div className="flex -space-x-1.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-6 rounded-full border-2 border-background bg-elevation-3"
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Team online</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
