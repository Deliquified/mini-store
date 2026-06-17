"use client";

import { useCallback } from "react";
import { useInstallApp } from "./useInstallApp";
import { useUpProvider } from "@/app/components/providers/upProvider";
import { App } from "@/data/appCatalog";
import { trackOpen } from "@/lib/trackOpen";

export type PrimaryActionKind = "open" | "install";

export interface PrimaryAction {
  kind: PrimaryActionKind; // "install" only when canInstallToGrid
  label: string; // "Open" | "Add to Grid"
  run: (app: App) => void; // openApp(app) or handleInstall(app)
}

export interface UseAppLaunch {
  // context
  canInstallToGrid: boolean; // walletConnected && isMiniApp
  isInGridContext: boolean; // alias of canInstallToGrid for readability
  // actions
  openApp: (app: App) => void; // opens app.app.url in a new top-level tab
  // resolver: single source of truth for "what is the primary button"
  getPrimaryAction: (app: App) => PrimaryAction;
  // secondary action (only meaningful in grid): Open shown beside Add-to-Grid
  getSecondaryAction: (app: App) => PrimaryAction | null;
  // passthrough of the existing install flow (kept intact)
  handleInstall: (app: App) => Promise<void>;
  handleUninstall: (app: App) => Promise<void>;
  isInstalled: (app: App) => boolean;
  isInstalling: boolean;
  isUninstalling: boolean;
  // GridSelectionDialog wiring (passed straight through from useInstallApp)
  showGridSelection: boolean;
  setShowGridSelection: (v: boolean) => void;
  pendingApp: App | null;
  handleGridSelect: (gridIndex: number) => void;
  handleGridSelectionCancel: () => void;
}

export function useAppLaunch(): UseAppLaunch {
  const install = useInstallApp();
  const { walletConnected, isMiniApp } = useUpProvider();

  const canInstallToGrid = walletConnected && isMiniApp;

  const openApp = useCallback((app: App) => {
    const url = app?.app?.url;
    if (!url) return;
    // Record the open before launching — every open path funnels through here,
    // and the store tab stays alive (new tab), so the signal reliably lands.
    trackOpen(app?.id);
    // "_blank" so launching never replaces the store/grid iframe content.
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const getPrimaryAction = useCallback(
    (_app: App): PrimaryAction => {
      if (canInstallToGrid) {
        return { kind: "install", label: "Add to Grid", run: install.handleInstall };
      }
      return { kind: "open", label: "Open", run: openApp };
    },
    [canInstallToGrid, install.handleInstall, openApp]
  );

  const getSecondaryAction = useCallback(
    (_app: App): PrimaryAction | null => {
      if (canInstallToGrid) {
        return { kind: "open", label: "Open", run: openApp };
      }
      return null;
    },
    [canInstallToGrid, openApp]
  );

  return {
    canInstallToGrid,
    isInGridContext: canInstallToGrid,
    openApp,
    getPrimaryAction,
    getSecondaryAction,
    handleInstall: install.handleInstall,
    handleUninstall: install.handleUninstall,
    isInstalled: install.isInstalled,
    isInstalling: install.isInstalling,
    isUninstalling: install.isUninstalling,
    showGridSelection: install.showGridSelection,
    setShowGridSelection: install.setShowGridSelection,
    pendingApp: install.pendingApp,
    handleGridSelect: install.handleGridSelect,
    handleGridSelectionCancel: install.handleGridSelectionCancel,
  };
}
