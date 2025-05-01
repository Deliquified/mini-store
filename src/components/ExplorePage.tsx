import FeaturedBanner from "./FeaturedBanner";
import AppCard from "./AppCard";
import AppSlider from "./AppSlider";
import TopChartsSlider from "./TopChartsSlider";
import Image from "next/image";
import { 
  getAppsByCategory, 
  getFeaturedApps,
  getTopCategories,
  categories,
  apps,
  App,
  Category
} from "@/data/appCatalog";

interface ExplorePageProps {
  onAppClick: (app: App) => void;
}

interface TopChartItemProps {
  app: App;
  rank: number;
  onAppClick: (app: App) => void;
}

const TopChartItem = ({ app, rank, onAppClick }: TopChartItemProps) => (
  <div 
    className="flex items-center p-2 w-full cursor-pointer hover:bg-gray-50"
    onClick={() => onAppClick(app)}
  >
    <span className="text-gray-500 font-medium text-lg mr-2 w-4">{rank}</span>
    <div className="relative w-16 h-16 rounded-xl overflow-hidden mr-3">
      <Image 
        src={app.icon} 
        alt={app.name}
        fill
        className="object-cover"
      />
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-gray-900 dark:text-white truncate">{app.name}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.subCategory || app.categories.join(", ")}</p>
    </div>
  </div>
);

interface CategoryCardProps {
  category: Category;
}

// Simple category card component
const CategoryCard = ({ category }: CategoryCardProps) => (
  <div className="flex flex-col items-center">
    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-2">
      <span className="text-[#0066FF] font-bold text-xl">{category.displayName.charAt(0)}</span>
    </div>
    <span className="text-xs text-center font-medium">{category.displayName}</span>
  </div>
);

export default function ExplorePage({ onAppClick }: ExplorePageProps) {
  // Get data from our centralized store
  const featured = getFeaturedApps();
  const topCategories = getTopCategories();
  
  // Get unique apps for each category
  const defiApps = getAppsByCategory("DeFi");
  const stakingApps = getAppsByCategory("Staking")
    .filter(app => !defiApps.some(defiApp => defiApp.id === app.id)); // Remove apps already in DeFi
  const nftApps = getAppsByCategory("NFTs");

  // For recommended apps, combine social and DeFi apps
  const recommendedApps = [...getAppsByCategory("Social"), ...getAppsByCategory("DeFi")]
    .filter((app, index, self) => 
      // Remove duplicates within recommendations
      index === self.findIndex(a => a.id === app.id)
    )
    .slice(0, 6); // Limit to 6 recommended apps

  return (
    <div className="space-y-6 pb-4">
      <FeaturedBanner apps={featured} onAppClick={onAppClick} />
      <AppSlider title="DeFi apps" apps={defiApps} onAppClick={onAppClick} />
      <TopChartsSlider apps={Object.values(apps)} onAppClick={onAppClick} />
      <AppSlider title="Recommended for you" apps={recommendedApps} onAppClick={onAppClick} />
    </div>
  );
}