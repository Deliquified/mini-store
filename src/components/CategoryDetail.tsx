import { ArrowLeft, Search, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { App, getAppsByCategory, Category } from "../data/appCatalog";
import Image from "next/image";
import { useState } from "react";
import AppDetailPage from "./AppDetailPage";
import { useInstallApp } from "@/hooks/useInstallApp";
import { useGrid } from "@/app/components/providers/gridProvider";
import GridSelectionDialog from "./GridSelectionDialog";

interface CategoryDetailProps {
  category: Category;
  onBack: () => void;
  onAppClick: (app: App) => void;
}

export default function CategoryDetail({ category, onBack, onAppClick }: CategoryDetailProps) {
  const { sections } = useGrid();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const apps = getAppsByCategory(category.id);
  const { 
    handleInstall, 
    handleUninstall, 
    isInstalling, 
    isUninstalling, 
    isInstalled,
    showGridSelection,
    setShowGridSelection,
    handleGridSelect,
    handleGridSelectionCancel
  } = useInstallApp();

  const handleAppSelection = (app: App) => {
    window.scrollTo(0, 0);
    onAppClick(app);
  };

  if (selectedApp) {
    return <AppDetailPage app={selectedApp} onBack={() => setSelectedApp(null)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>
        </div>
      </header>

      {/* App List */}
      <div className="flex-1 mx-auto py-6">
        <div className="space-y-4">
          {apps.map((app) => {
            const appIsInstalled = isInstalled(app);
            const isLoading = appIsInstalled ? isUninstalling : isInstalling;
            
            return (
              <div
                key={app.id}
                className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-4"
                onClick={() => setSelectedApp(app)}
              >
                <div className="relative w-full aspect-square mb-2 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <Image
                    src={app.icon || ""}
                    alt={app.app.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="w-full">
                  <h3 className="text-sm font-medium truncate">{app.app.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{app.developer}</p>
                </div>
                <Button
                  variant={appIsInstalled ? "outline" : "default"}
                  className={`flex-shrink-0 w-24 ${
                    appIsInstalled 
                      ? 'bg-white text-blue-600 border-gray-200 hover:bg-gray-50' 
                      : 'bg-[#0066FF] hover:bg-blue-700 text-white border-0'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (appIsInstalled) {
                      setSelectedApp(app);
                    } else {
                      handleInstall(app);
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                        appIsInstalled ? 'border-blue-600' : 'border-white'
                      }`} />
                      <span>Installing...</span>
                    </div>
                  ) : (
                    appIsInstalled ? "View" : "Install"
                  )}
                </Button>
              </div>
            );
          })}

          {apps.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No apps found in this category
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Grid Selection Dialog */}
      <GridSelectionDialog
        open={showGridSelection}
        onOpenChange={setShowGridSelection}
        sections={sections}
        appName="App"
        onGridSelect={handleGridSelect}
        onCancel={handleGridSelectionCancel}
      />
    </div>
  );
} 