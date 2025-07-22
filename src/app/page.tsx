"use client";

import { useState, useEffect } from "react";
import { useProfile } from "./components/providers/profileProvider";
import { useUpProvider } from "./components/providers/upProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, LayoutGrid, Search, ShoppingBag, Squirrel, Users, Brain, Gamepad2, Landmark, Palette, Music, ShoppingCart, Shield, Bot, Building2, Coins, Shirt, BookOpen, Globe, Star, BadgePercent, Store, Layers3 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ExplorePage from "@/components/ExplorePage";
import MyAppsPage from "@/components/MyAppsPage";
import SearchPage from "@/components/SearchPage";
import AppDetailPage from "../components/AppDetailPage";
import { App } from "@/data/appCatalog";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const { profileData } = useProfile();
  const { walletConnected, isMiniApp, isLoading } = useUpProvider();
  const [activeTab, setActiveTab] = useState("explore");
  const [scrolled, setScrolled] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('HomePage: isLoading:', isLoading, 'isMiniApp:', isMiniApp, 'walletConnected:', walletConnected);
  }, [isLoading, isMiniApp, walletConnected]);

  // Update connection status when wallet connection changes
  useEffect(() => {
    setIsConnected(walletConnected);
  }, [walletConnected]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Handle app selection
  const handleAppClick = (app: App) => {
    window.scrollTo(0, 0);
    setSelectedApp(app);
  };

  const handleBackFromApp = () => {
    window.scrollTo(0, 0);
    setSelectedApp(null);
  };

  // Navigation item styles
  const getNavItemStyles = (tabName: string) => {
    const isActive = activeTab === tabName;
    return {
      button: `flex flex-col items-center justify-center space-y-1 h-auto py-2 w-full rounded-none relative ${
        isActive ? "text-[#0066FF]" : "text-gray-500"
      }`,
      icon: `h-6 w-6 ${isActive ? "text-[#0066FF]" : "text-gray-500"}`,
      text: `text-xs ${isActive ? "text-[#0066FF] font-medium" : "text-gray-500"}`,
      indicator: isActive ? "block" : "hidden"
    };
  };

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    window.scrollTo(0, 0);
    setActiveTab(tab);
    setSelectedApp(null);
  };

  // Show loading screen while determining context
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center">
        <Squirrel className="h-16 w-16 text-[#0066FF] mb-4 animate-pulse" />
        <span className="text-xl font-semibold mb-2">Mini Store</span>
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  // If not in mini-app context, show landing page
  if (!isMiniApp) {
    return <LandingPage />;
  }

  // Explore tab styles
  const exploreStyles = getNavItemStyles("explore");
  // Apps tab styles
  const appsStyles = getNavItemStyles("apps");
  // Search tab styles
  const searchStyles = getNavItemStyles("search");

  // Render the appropriate content based on the active tab
  const renderContent = () => {
    if (selectedApp) {
      return <AppDetailPage app={selectedApp} onBack={handleBackFromApp} />;
    }

    switch (activeTab) {
      case "explore":
        return <ExplorePage onAppClick={handleAppClick} />;
      case "apps":
        return <MyAppsPage onAppClick={handleAppClick} />;
      case "search":
        return <SearchPage onAppClick={handleAppClick} />;
      default:
        return <ExplorePage onAppClick={handleAppClick} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background dark:bg-gray-900">
      {/* Top Header */}
      {activeTab !== "apps" && activeTab !== "search" && (
        <header className={`sticky top-0 z-10 bg-background dark:bg-gray-800 transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'shadow-none'
        }`}>
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex items-center">
              <Squirrel className="h-6 w-6 mr-2 text-[#0066FF]" />
            </div>
            
            <div className="flex items-center">
              {/* Original UP Avatar - commented out for potential reversion
              <Avatar className="ml-2 h-8 w-8">
                <AvatarImage 
                  src={profileData?.profileImages?.[0]?.url || ""} 
                  alt={profileData?.name || "Profile"} 
                />
                <AvatarFallback className="text-xs">UP</AvatarFallback>
              </Avatar>
              */}
              <Button 
                variant="outline" 
                size="sm"
                className="text-[#0066FF] border-[#0066FF] hover:bg-[#0066FF] hover:text-white"
                asChild
              >
                <a 
                  href="https://github.com/Deliquified/mini-apps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Submit Mini-App
                </a>
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-20">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-10 bg-background dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto grid grid-cols-2 items-center py-2">
          <Button 
            variant="ghost" 
            className={`${exploreStyles.button} hover:bg-transparent focus:bg-transparent active:bg-transparent`}
            onClick={() => handleTabChange("explore")}
          >
            <Compass className={exploreStyles.icon} />
            <span className={exploreStyles.text}>Explore</span>
          </Button>
          
          {/*<Button 
            variant="ghost" 
            className={`${appsStyles.button} hover:bg-transparent focus:bg-transparent active:bg-transparent`}
            onClick={() => handleTabChange("apps")}
          >
            <LayoutGrid className={appsStyles.icon} />
            <span className={appsStyles.text}>My Apps</span>
          </Button>*/}
          
          <Button 
            variant="ghost" 
            className={`${searchStyles.button} hover:bg-transparent focus:bg-transparent active:bg-transparent`}
            onClick={() => handleTabChange("search")}
          >
            <Search className={searchStyles.icon} />
            <span className={searchStyles.text}>Search</span>
          </Button>
        </div>
      </nav>
    </div>
  );
} 