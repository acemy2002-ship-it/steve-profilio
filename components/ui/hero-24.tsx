"use client";

import { Play } from "lucide-react";
import { motion, type Variants } from "motion/react";

interface NavLink {
  label: string;
  href: string;
}

interface Hero24Props {
  brandName?: string;
  navLinks?: NavLink[];
  headingLine1?: string;
  headingLine2Prefix?: string;
  headingHighlight?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  videoHref?: string;
  loginLabel?: string;
  loginHref?: string;
  backgroundImage?: string;
}

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const backgroundVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1, x: 20, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 16, mass: 1.5 },
  },
};

const copyVariants: Variants = {
  hidden: { opacity: 0, rotateY: -10, x: -16, scale: 0.97 },
  visible: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 28, mass: 0.9 },
  },
};

const ctaGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, scale: 0.78, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 22, mass: 0.7 },
  },
};

export default function Hero24({
  headingLine1 = "Where Vision Begins",
  headingLine2Prefix = "and Ideas",
  headingHighlight = "Bloom",
  description = "From quiet inspiration to meaningful innovation, we create smart tools that shape tomorrow.",
  primaryCtaLabel = "Book a demo",
  primaryCtaHref = "#",
  videoHref = "#",

  backgroundImage = "https://res.cloudinary.com/uyecgpkd/image/upload/v1794414022/thumb-1920-1149399.avif",
}: Hero24Props) {
  return (
    <section className="relative isolate min-h-screen overflow-hidden">
      <motion.div
        className="relative flex min-h-screen w-full flex-col overflow-hidden px-6 py-4 sm:px-10 lg:px-[4.9rem]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.34 }}
        variants={sectionVariants}
      >
        <motion.img
          variants={backgroundVariants}
          src={backgroundImage}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        <div className="relative z-10 flex flex-1 flex-col justify-start pt-20 sm:pt-32 md:pt-24 2xl:pt-50">
          <div className="max-w-4xl">
            <motion.h1
              variants={copyVariants}
              className="max-w-4xl text-[clamp(3.45rem,6vw,6.25rem)] leading-[0.9] font-thin tracking-[-0.02em] text-balance "
            >
              <span className="block">{headingLine1}</span>
              <span className="block">
                {headingLine2Prefix}{" "}
                <span className="italic">{headingHighlight}</span>
              </span>
            </motion.h1>

            <motion.p
              variants={copyVariants}
              className="text-md mt-6 max-w-xl leading-[1.45] font-medium text-pretty"
            >
              {description}
            </motion.p>

            <motion.div
              variants={ctaGroupVariants}
              className="mt-7 flex items-center gap-3"
            >
              <motion.a
                variants={ctaVariants}
                href={primaryCtaHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-medium text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-slate-800 hover:shadow-[0_20px_42px_rgba(15,23,42,0.24)] active:scale-[0.96]"
              >
                {primaryCtaLabel}
              </motion.a>
              <motion.a
                variants={ctaVariants}
                href={videoHref}
                aria-label="Play video"
                className="group inline-flex size-11 items-center justify-center rounded-full bg-zinc-100 text-slate-900 shadow-[0_18px_50px_rgba(12,74,110,0.12),inset_0_1px_0_1px_rgba(255,255,255,0.35)] transition-[box-shadow,transform] duration-200 ease-out hover:shadow-[0_20px_42px_rgba(12,74,110,0.2),inset_0_0_0_1px_rgba(255,255,255,0.9)] active:scale-[0.96]"
              >
                <Play className="ml-0.5 size-4 fill-current transition-transform duration-200 ease-out group-hover:scale-110" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
