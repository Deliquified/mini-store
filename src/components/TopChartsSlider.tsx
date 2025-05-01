import { App, getAppsByCategory } from "@/data/appCatalog";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState } from "react";

interface TopChartsSliderProps {
  apps: App[];
  onAppClick: (app: App) => void;
}

type ChartFilter = "defi" | "staking" | "nfts";

export default function TopChartsSlider({ apps, onAppClick }: TopChartsSliderProps) {
  const [activeFilter, setActiveFilter] = useState<ChartFilter>("defi");
  
  if (!apps || apps.length === 0) {
    return null;
  }

  // Filter apps based on the selected category
  const getFilteredApps = () => {
    const category = activeFilter === "defi" ? "DeFi" :
                    activeFilter === "staking" ? "Staking" :
                    "NFTs";
    
    // Get apps for the selected category
    const categoryApps = getAppsByCategory(category);
    
    // If it's staking category, remove apps that are already in DeFi category
    if (category === "Staking") {
      const defiApps = getAppsByCategory("DeFi");
      return categoryApps.filter(app => !defiApps.some(defiApp => defiApp.id === app.id));
    }
    
    return categoryApps;
  };

  const filteredApps = getFilteredApps();
  
  // Create groups of 3 apps for each column
  const appGroups = [];
  for (let i = 0; i < filteredApps.length; i += 3) {
    appGroups.push(filteredApps.slice(i, i + 3));
  }

  return (
    <section className="mb-8">
      <h2 className="text-[16px] font-bold mb-3 font-roboto">Top charts</h2>
      
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveFilter("defi")}
          className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border border-1 min-w-[90px] text-center ${
            activeFilter === "defi" 
              ? "bg-blue-50 text-blue-700 border-blue-50 font-bold" 
              : "bg-white text-gray-700 border-gray-200 font-medium"
          }`}
        >
          Top DeFi
        </button>
        <button 
          onClick={() => setActiveFilter("staking")}
          className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border border-1 min-w-[110px] text-center ${
            activeFilter === "staking" 
              ? "bg-blue-50 text-blue-700 border-blue-50 font-bold" 
              : "bg-white text-gray-700 border-gray-200 font-medium"
          }`}
        >
          Top Staking
        </button>
        <button 
          onClick={() => setActiveFilter("nfts")}
          className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border border-1 min-w-[90px] text-center ${
            activeFilter === "nfts" 
              ? "bg-blue-50 text-blue-700 border-blue-50 font-bold" 
              : "bg-white text-gray-700 border-gray-200 font-medium"
          }`}
        >
          Top NFTs
        </button>
      </div>
      
      {/* App columns */}
      <Carousel className="w-full" opts={{ align: "start" }}>
        <CarouselContent className="-ml-2 md:-ml-4">
          {appGroups.map((group, groupIndex) => (
            <CarouselItem key={groupIndex} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <div className="border-b border-gray-100">
                {group.map((app, index) => (
                  <div 
                    key={app.id} 
                    className="flex items-center py-3 px-1 cursor-pointer hover:bg-gray-50"
                    onClick={() => onAppClick(app)}
                  >
                    {/* Rank number */}
                    <span className="text-gray-400 font-medium mr-4 w-3 text-right">
                      {groupIndex * 3 + index + 1}
                    </span>
                    
                    {/* App icon */}
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden mr-3">
                      <Image
                        src={app.icon}
                        alt={app.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {/* App details */}
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{app.name}</h3>
                      <p className="text-xs text-gray-500">{app.categories[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
} 