import Image from "next/image";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  /** Renders a larger lockup for loading / hero contexts. */
  size?: "sm" | "md" | "lg";
}

/**
 * "LUKSO UP!Store" wordmark.
 * "LUKSO" in display weight with a single gradient underline accent (the one
 * sanctioned gradient gesture in chrome); the UP! app badge stands in for the
 * "UP!" so the lockup reads "LUKSO UP!Store"; "Store" in secondary text.
 */
export function Wordmark({ className, size = "md" }: WordmarkProps) {
  const text =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const badge = size === "lg" ? 40 : size === "sm" ? 22 : 26;
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 select-none", text, className)}
      aria-label="LUKSO UP!Store"
    >
      <span className="relative font-display font-semibold tracking-tight text-foreground">
        LUKSO
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-brand-gradient-soft"
        />
      </span>
      <span className="inline-flex items-center gap-1">
        <Image
          src="/up-logo.png"
          alt="UP!"
          width={badge}
          height={badge}
          priority
          className="rounded-[28%] shadow-rest"
          style={{ width: badge, height: badge }}
        />
        <span className="font-display font-medium text-text-secondary">Store</span>
      </span>
    </span>
  );
}

export default Wordmark;
