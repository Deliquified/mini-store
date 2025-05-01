import Image from "next/image";

interface AppCardProps {
  name: string;
  icon: string;
  category?: string;
  size?: "normal" | "small";
}

export default function AppCard({ name, icon, category, size = "normal" }: AppCardProps) {
  return (
    <div className={`flex flex-col ${size === "normal" ? "w-24" : "w-20"}`}>
      <div className={`relative ${size === "normal" ? "w-24 h-24" : "w-20 h-20"} rounded-xl overflow-hidden mb-1`}>
        <Image 
          src={icon} 
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-0.5">
        <h3 className={`font-medium text-gray-900 dark:text-white truncate ${size === "normal" ? "text-sm" : "text-xs"}`}>
          {name}
        </h3>
        {category && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {category}
          </p>
        )}
      </div>
    </div>
  );
} 