"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function CinemaRail({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="cinema-rail ps-5 lg:ps-[max(1.25rem,calc((100vw-72rem)/2+2rem))]"
      initial={reduce ? false : { opacity: 0, x: 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
