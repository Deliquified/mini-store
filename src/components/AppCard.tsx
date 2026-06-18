"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface AppCardProps {
  name: string;
  icon: string;
  category?: string;
  size?: "normal" | "small";
}

const SIZES = {
  normal: {
    tile: "w-24",
    icon: "h-24 w-24",
    name: "text-sm",
    iconPx: 96,
  },
  small: {
    tile: "w-20",
    icon: "h-20 w-20",
    name: "text-xs",
    iconPx: 80,
  },
} as const;

export default function AppCard({
  name,
  icon,
  category,
  size = "normal",
}: AppCardProps) {
  const reduceMotion = useReducedMotion();
  const s = SIZES[size];

  return (
    <motion.div
      className={`group flex shrink-0 flex-col rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${s.tile}`}
      initial={false}
      whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Squircle app icon — iOS-style ~22% rounding */}
      <div
        className={`relative ${s.icon} overflow-hidden rounded-2xl border border-border bg-muted shadow-rest transition-shadow duration-150 group-hover:shadow-hover`}
      >
        <Image
          src={icon}
          alt={`${name} app icon`}
          fill
          sizes={`${s.iconPx}px`}
          className="object-contain"
        />
        {/* Subtle glass sheen for depth — pointer-events safe */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"
        />
      </div>

      <div className="mt-2 min-w-0 space-y-0.5 px-0.5">
        <h3
          className={`truncate font-medium leading-tight text-foreground ${s.name}`}
          title={name}
        >
          {name}
        </h3>
        {category && (
          <p
            className="truncate text-[11px] font-medium uppercase leading-tight tracking-[0.04em] text-text-secondary"
            title={category}
          >
            {category}
          </p>
        )}
      </div>
    </motion.div>
  );
}
