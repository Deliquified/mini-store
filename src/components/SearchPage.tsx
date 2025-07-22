import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useProfile } from "../app/components/providers/profileProvider";
import { useState, useEffect } from "react";
import { Mic, Search, Users, Brain, Gamepad2, Landmark, Palette, Music, ShoppingCart, Shield, Bot, Building2, Coins, Shirt, BookOpen, Globe, Star, BadgePercent, Store, Layers3 } from "lucide-react";
import { categories as appCategories, getTopCategories, Category, App, apps } from "../data/appCatalog";
import CategoryDetail from "./CategoryDetail";
import { searchApps } from "@/utils/search";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useInstallApp } from "@/hooks/useInstallApp";
import { useGrid } from "@/app/components/providers/gridProvider";
import GridSelectionDialog from "./GridSelectionDialog";

interface SearchPageProps {
  onAppClick: (app: App) => void;
}

// Map category name to Lucide icon
const categoryIcons: Record<string, React.ReactNode> = {
  "Art": <Palette className="h-5 w-5 text-[#0066FF]" />,
  "AI": <Brain className="h-5 w-5 text-[#0066FF]" />,
  "Brands": <Store className="h-5 w-5 text-[#0066FF]" />,
  "Community": <Users className="h-5 w-5 text-[#0066FF]" />,
  "DAOs": <Landmark className="h-5 w-5 text-[#0066FF]" />,
  "DeFi": <Coins className="h-5 w-5 text-[#0066FF]" />,
  "Exchanges": <BadgePercent className="h-5 w-5 text-[#0066FF]" />,
  "Fashion": <Shirt className="h-5 w-5 text-[#0066FF]" />,
  "Gaming": <Gamepad2 className="h-5 w-5 text-[#0066FF]" />,
  "Infrastructure": <Layers3 className="h-5 w-5 text-[#0066FF]" />,
  "Marketplaces": <ShoppingCart className="h-5 w-5 text-[#0066FF]" />,
  "Mini-Apps": <Bot className="h-5 w-5 text-[#0066FF]" />,
  "Music": <Music className="h-5 w-5 text-[#0066FF]" />,
  "NFTs": <Star className="h-5 w-5 text-[#0066FF]" />,
  "Security": <Shield className="h-5 w-5 text-[#0066FF]" />,
  "Social": <Globe className="h-5 w-5 text-[#0066FF]" />,
  "Staking": <BookOpen className="h-5 w-5 text-[#0066FF]" />,
};

export default function SearchPage({ onAppClick }: SearchPageProps) {
  const { profileData } = useProfile();
  const { sections } = useGrid();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchResults, setSearchResults] = useState<App[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { 
    handleInstall, 
    isInstalling,
    showGridSelection,
    setShowGridSelection,
    handleGridSelect,
    handleGridSelectionCancel
  } = useInstallApp();

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const results = searchApps(Object.values(apps), searchTerm);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchTerm]);

  const allCategories = Object.values(appCategories);

  const handleCategoryClick = (category: Category) => {
    window.scrollTo(0, 0);
    setSelectedCategory(category);
  };

  if (selectedCategory) {
    return (
      <CategoryDetail 
        category={selectedCategory} 
        onBack={() => {
          window.scrollTo(0, 0);
          setSelectedCategory(null);
        }}
        onAppClick={onAppClick}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-background dark:bg-gray-800">
        <div className="container mx-auto py-3">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search apps"
                className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 dark:border-gray-700 focus-visible:ring-1 focus-visible:ring-[#0066FF]/70 focus:border-[#0066FF]/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Avatar className="h-10 w-10 ml-3">
              <AvatarImage 
                src={profileData?.profileImages?.[0]?.url || "https://via.placeholder.com/40?text=UP"} 
                alt={profileData?.name || "Profile"} 
              />
              <AvatarFallback>UP</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        {!isSearching ? (
          <>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Explore apps
            </h1>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 gap-4">
              {allCategories.map((category) => (
                <button
                  key={category.id}
                  className="flex items-center justify-between px-4 py-3 bg-[#F5F8FF] dark:bg-gray-800 rounded-xl transition-colors hover:bg-[#EBF1FF]"
                  onClick={() => handleCategoryClick(category)}
                >
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    {category.displayName}
                  </span>
                  <span>{categoryIcons[category.name] || <Star className="h-5 w-5 text-[#0066FF]" />}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {searchResults.length} results
            </h2>
            {searchResults.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-4"
                onClick={() => onAppClick(app)}
              >
                <div className="relative h-16 w-16 rounded-xl overflow-hidden mr-3">
                  <Image
                    src={app.icon || ""}
                    alt={app.app.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{app.app.name}</h3>
                  <p className="text-sm text-gray-600">{app.developer}</p>
                  <div className="flex gap-1 mt-1">
                    {app.categories.slice(0, 2).map((category, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInstall(app);
                  }}
                  disabled={isInstalling}
                >
                  {isInstalling ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Installing...</span>
                    </div>
                  ) : (
                    "Install"
                  )}
                </Button>
              </div>
            ))}
            {searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No apps found matching "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        )}
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