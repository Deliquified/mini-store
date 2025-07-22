import Image from "next/image";
import { Button } from "@/components/ui/button";
import { apps } from "@/data/appCatalog";
import { ArrowRight } from "lucide-react";

export default function FeaturedApps() {
  // Get the first two apps from the catalog
  const featuredApps = Object.values(apps).slice(0, 2);

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {featuredApps.map((app) => (
        <div 
          key={app.id} 
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={app.icon || ""}
                alt={app.app.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{app.app.name}</h3>
              <p className="text-blue-600 text-sm mb-2">{app.developer}</p>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {app.developer ? `Built by ${app.developer}` : "No description available"}
              </p>
              <div className="flex flex-wrap gap-2">
                {app.categories.slice(0, 2).map((category, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/*<div className="mt-4 flex justify-end">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>*/}
        </div>
      ))}
    </div>
  );
} 