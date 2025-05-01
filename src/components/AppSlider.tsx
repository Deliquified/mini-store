import { App, getPrimaryCategory } from "@/data/appCatalog";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface AppSliderProps {
  title: string;
  apps: App[];
  onAppClick: (app: App) => void;
}

export default function AppSlider({ title, apps, onAppClick }: AppSliderProps) {
  if (!apps || apps.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-[16px] font-bold mb-4 font-roboto">{title}</h2>
      <Carousel className="w-full" opts={{ align: "start" }}>
        <CarouselContent className="-ml-4">
          {apps.map((app) => (
            <CarouselItem key={app.id} className="pl-4 basis-[120px] md:basis-[120px] lg:basis-[120px] min-w-[120px]">
              <div 
                className="flex flex-col items-start w-full cursor-pointer"
                onClick={() => onAppClick(app)}
              >
                <div className="relative w-full aspect-square mb-2 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <Image
                    src={app.icon}
                    alt={app.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-[14px] font-medium w-full opacity-80">{app.appName}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
} 