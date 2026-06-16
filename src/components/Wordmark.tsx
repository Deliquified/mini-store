import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  /** Renders a larger lockup for loading / hero contexts. */
  size?: "sm" | "md" | "lg";
}

/**
 * Neutral "LUKSO App Store" wordmark. No squirrel.
 * "LUKSO" in display weight with a single gradient underline accent (the one
 * sanctioned gradient gesture in chrome); "App Store" in secondary text.
 */
export function Wordmark({ className, size = "md" }: WordmarkProps) {
  const text =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <span
      className={cn("inline-flex items-baseline gap-1.5 select-none", text, className)}
      aria-label="LUKSO App Store"
    >
      <span className="relative font-display font-semibold tracking-tight text-foreground">
        LUKSO
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-brand-gradient-soft"
        />
      </span>
      <span className="font-display font-medium text-text-secondary">App Store</span>
    </span>
  );
}

export default Wordmark;
