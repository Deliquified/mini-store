"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { LayoutGrid, Lock, Globe, X, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGrid } from "@/app/components/providers/gridProvider";
import { cn } from "@/lib/utils";

interface GridSection {
  title: string;
  grid: any[];
  gridColumns: number;
  visibility?: "public" | "private";
  isPrivate?: boolean; // Legacy property
}

interface GridSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: GridSection[];
  appName: string;
  onGridSelect: (gridIndex: number) => void;
  onCancel: () => void;
}

/* ---- Shared glass shell (motion-aware overlay + panel) ---- */
function GlassDialogShell({
  open,
  onOpenChange,
  onClose,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  const enter: Transition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.2 }}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[2px]"
          />
        </DialogPrimitive.Overlay>

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed z-50 focus:outline-none",
            // Mobile: bottom sheet, full width, safe-area aware
            "inset-x-0 bottom-0 w-full pb-safe",
            // Desktop: centered
            "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-full sm:max-w-[480px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:pb-0"
          )}
        >
          <motion.div
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 24, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={enter}
            className={cn(
              "glass-strong relative overflow-hidden",
              // Mobile bottom-sheet rounding (top corners only), desktop full radius
              "rounded-t-[28px] rounded-b-none border-b-0",
              "sm:rounded-[28px] sm:border-b"
            )}
          >
            {/* Ambient brand glow behind the header */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-glow-ambient"
            />

            {/* Mobile grab handle */}
            <div className="flex justify-center pt-3 sm:hidden">
              <span className="h-1.5 w-10 rounded-full bg-border-strong" />
            </div>

            {/* Close button */}
            <DialogPrimitive.Close
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>

            <div className="relative px-6 pb-8 pt-6 sm:pb-7">{children}</div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ---- Header: icon + title + subtitle ---- */
function DialogHead({
  title,
  subtitle,
  tone = "default",
}: {
  title: string;
  subtitle: React.ReactNode;
  tone?: "default" | "error";
}) {
  return (
    <div className="mb-6 flex flex-col items-center text-center">
      <span
        className={cn(
          "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl",
          tone === "error"
            ? "bg-destructive/10 text-destructive"
            : "bg-brand-gradient-cta text-white shadow-cta ring-1 ring-inset ring-white/15"
        )}
      >
        {tone === "error" ? (
          <AlertCircle className="h-6 w-6" />
        ) : (
          <LayoutGrid className="h-6 w-6" />
        )}
      </span>
      <DialogPrimitive.Title className="font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
        {title}
      </DialogPrimitive.Title>
      <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-text-secondary">
        {subtitle}
      </p>
    </div>
  );
}

export default function GridSelectionDialog({
  open,
  onOpenChange,
  sections,
  appName,
  onGridSelect,
  onCancel,
}: GridSelectionDialogProps) {
  const [selectedGridIndex, setSelectedGridIndex] = useState<string>("");
  const { isLoading, error } = useGrid();

  // Separate public and private grids - handle both old and new schema
  const publicGrids = sections.filter((section) => {
    // New schema: visibility === "public"
    if (section.visibility !== undefined) {
      return section.visibility === "public";
    }
    // Legacy schema: isPrivate === false (or undefined, default to public)
    return section.isPrivate === false || section.isPrivate === undefined;
  });

  const privateGrids = sections.filter((section) => {
    // New schema: visibility === "private"
    if (section.visibility !== undefined) {
      return section.visibility === "private";
    }
    // Legacy schema: isPrivate === true
    return section.isPrivate === true;
  });

  const handleDone = () => {
    if (selectedGridIndex) {
      onGridSelect(parseInt(selectedGridIndex));
    }
  };

  const handleCancel = () => {
    setSelectedGridIndex("");
    onCancel();
  };

  const handleClose = () => {
    setSelectedGridIndex("");
    onOpenChange(false);
  };

  // Render a grid option (shared between public/private groups)
  const renderGridOption = (grid: GridSection, keyPrefix: string) => {
    const originalIndex = sections.findIndex((s) => s.title === grid.title);
    const widgetCount = grid.grid.length;
    return (
      <SelectItem
        key={`${keyPrefix}-${grid.title}`}
        value={originalIndex.toString()}
        className="rounded-md py-2"
      >
        <div className="flex flex-col items-start">
          <span className="font-medium text-foreground">{grid.title}</span>
          <span className="text-xs text-text-secondary">
            {widgetCount} widget{widgetCount !== 1 ? "s" : ""} •{" "}
            {grid.gridColumns} columns
          </span>
        </div>
      </SelectItem>
    );
  };

  // ---- Loading state ----
  if (isLoading) {
    return (
      <GlassDialogShell
        open={open}
        onOpenChange={onOpenChange}
        onClose={handleClose}
      >
        <DialogHead
          title="Add to your Grid"
          subtitle="Loading your Universal Profile grids..."
        />
        <div className="flex justify-center py-6" role="status" aria-live="polite">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-brand" />
          <span className="sr-only">Loading grids</span>
        </div>
      </GlassDialogShell>
    );
  }

  // ---- Error state ----
  if (error) {
    return (
      <GlassDialogShell
        open={open}
        onOpenChange={onOpenChange}
        onClose={handleClose}
      >
        <DialogHead
          title="Something went wrong"
          subtitle={
            <>
              We couldn&apos;t load your grids.
              <span className="mt-1 block text-text-tertiary">{error}</span>
            </>
          }
          tone="error"
        />
        <Button
          onClick={handleCancel}
          variant="ghost-outline"
          size="pill"
          className="w-full"
        >
          Close
        </Button>
      </GlassDialogShell>
    );
  }

  // ---- Empty state ----
  if (!sections || sections.length === 0) {
    return (
      <GlassDialogShell
        open={open}
        onOpenChange={onOpenChange}
        onClose={handleClose}
      >
        <DialogHead
          title="No grids found"
          subtitle="There are no grids on your Universal Profile yet. Create a grid first, then come back to add this app."
        />
        <Button
          onClick={handleCancel}
          variant="ghost-outline"
          size="pill"
          className="w-full"
        >
          Close
        </Button>
      </GlassDialogShell>
    );
  }

  // ---- Select state ----
  return (
    <GlassDialogShell
      open={open}
      onOpenChange={onOpenChange}
      onClose={handleClose}
    >
      <DialogHead
        title="Add to your Grid"
        subtitle={
          <>
            Choose which grid to add{" "}
            <span className="font-medium text-foreground">{appName}</span> to.
          </>
        }
      />

      <div className="space-y-6">
        {/* Grid picker */}
        <div className="space-y-2">
          <label
            htmlFor="grid-select"
            className="block text-[11px] font-medium uppercase tracking-[0.06em] text-text-tertiary"
          >
            Destination grid
          </label>
          <Select
            value={selectedGridIndex}
            onValueChange={setSelectedGridIndex}
          >
            <SelectTrigger
              id="grid-select"
              className="h-12 w-full rounded-md border-border-strong bg-card text-base focus:ring-ring sm:text-sm"
            >
              <SelectValue placeholder="Select a grid..." />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-border bg-popover">
              {/* Public Grids Section */}
              {publicGrids.length > 0 && (
                <>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-text-tertiary">
                    <Globe className="h-3 w-3" />
                    Public grids
                  </div>
                  {publicGrids.map((grid) => renderGridOption(grid, "public"))}
                </>
              )}

              {/* My Apps / Private Grids Section */}
              {privateGrids.length > 0 && (
                <>
                  <div className="mt-2 flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-text-tertiary">
                    <Lock className="h-3 w-3" />
                    My apps
                  </div>
                  {privateGrids.map((grid) => renderGridOption(grid, "private"))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            onClick={handleCancel}
            variant="ghost-outline"
            size="pill"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDone}
            disabled={!selectedGridIndex}
            variant="gradient"
            size="pill"
            className="flex-1 disabled:opacity-50 disabled:shadow-none"
          >
            Add to Grid
          </Button>
        </div>
      </div>
    </GlassDialogShell>
  );
}
