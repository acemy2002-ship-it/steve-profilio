"use client";

import { LayoutGroup, motion } from "motion/react";

import type { ReactNode } from "react";

import { ContactButton } from "@/components/contact/contact-button";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroCtas(): ReactNode {
  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{ layout: { duration: 0.55, ease: EASE } }}
        className="mt-2 flex flex-wrap items-center gap-3"
      >
        <span className="text-foreground/65 text-[22px] leading-[1.4] tracking-tight">
          Reach out to me
        </span>
        <ContactButton />
      </motion.div>
    </LayoutGroup>
  );
}
