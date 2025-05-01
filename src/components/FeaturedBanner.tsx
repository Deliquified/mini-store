import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FeaturedApp, getPrimaryCategory } from "@/data/appCatalog";
import { useInstallApp } from "@/hooks/useInstallApp";

interface FeaturedBannerProps {
  apps: FeaturedApp[];
  onAppClick: (app: FeaturedApp) => void;
}

export default function FeaturedBanner({ apps, onAppClick }: FeaturedBannerProps) {
  const { handleInstall, isInstalling, isInstalled } = useInstallApp();

  return (
    <section className="mb-8">
      <Carousel className="w-full" opts={{ align: "start" }}>
        <CarouselContent>
          {apps.map((app) => {
            const appIsInstalled = isInstalled(app);
            
            return (
              <CarouselItem key={app.id}>
                <div 
                  className="relative h-48 w-full overflow-hidden rounded-xl cursor-pointer z-10"
                  onClick={() => onAppClick(app)}
                >
                  <Image 
                    src={app.banner} 
                    alt={app.title}
                    fill
                    priority
                    className="object-fill"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  
                  {/* Title on the bottom left */}
                  <div className="absolute bottom-12 left-4">
                    <h3 className="text-xl font-bold text-white font-roboto">{app.title}</h3>
                  </div>
                  
                  {/* App logo and category below title */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                    <div className="relative h-7 w-7 rounded-full overflow-hidden">
                      <Image 
                        src={app.appIcon || app.icon} 
                        alt={app.appName || app.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex space-x-1">
                      <p className="text-xs text-white font-medium">{app.appName || app.name}</p>
                      <p className="text-xs text-gray-300">{getPrimaryCategory(app)}</p>
                    </div>
                  </div>
                  
                  {/* Install/View button on the right */}
                  <div className="absolute bottom-4 right-4 z-50">
                    <Button 
                      className={`h-8 px-4 py-1 text-xs rounded-md ${
                        appIsInstalled 
                          ? 'bg-transparent border border-white text-white hover:bg-white/10' 
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!appIsInstalled) {
                          handleInstall(app);
                        } else {
                          onAppClick(app);
                        }
                      }}
                      disabled={isInstalling}
                    >
                      {isInstalling ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Installing...</span>
                        </div>
                      ) : (
                        appIsInstalled ? "View" : "Install"
                      )}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}