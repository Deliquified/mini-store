import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, Share, Bookmark, Info, ChevronRight, X, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { App } from "@/data/appCatalog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery, gql } from "@apollo/client";
import { client as apolloClient } from "@/app/components/apollo/apolloClient";
import { useGrid } from '@/app/components/providers/gridProvider';
import { toast } from 'sonner';
import { ERC725 } from '@erc725/erc725.js';
import { useUpProvider } from '@/app/components/providers/upProvider';
import { createPublicClient, http } from 'viem';
import { lukso } from 'viem/chains';
import { useInstallApp } from "@/hooks/useInstallApp";
import { GET_UNIVERSAL_PROFILE } from "@/app/components/apollo/query";
import GridSelectionDialog from "./GridSelectionDialog";

// Helper function to convert IPFS URL to HTTP URL
const convertIpfsUrl = (url: string): string => {
  if (!url) return "";
  
  // Check if it's an IPFS URL
  if (url.startsWith('ipfs://')) {
    // Extract the CID (content identifier)
    const cid = url.replace('ipfs://', '');
    // Return the gateway URL
    return `https://api.universalprofile.cloud/ipfs/${cid}`;
  }
  
  return url;
};

// Interfaces for universal profile
interface ProfileLink {
  title: string;
  url: string;
}

interface ProfileImage {
  url: string;
}

interface BackgroundImage {
  url: string;
  width: number;
  height: number;
  verified: boolean;
  method: string;
  data: string;
}

interface FollowerProfile {
  id: string;
  name: string;
  description: string;
  tags: string[];
  links: ProfileLink[];
  backgroundImages: BackgroundImage[];
  profileImages: ProfileImage[];
}

interface Following {
  followee: FollowerProfile;
}

interface Followed {
  follower: FollowerProfile;
}

interface LSP5Asset {
  asset: {
    id: string;
  };
}

interface LSP12Asset {
  asset: {
    id: string;
  };
}

interface UniversalProfileDetails {
  id: string;
  name: string;
  description: string;
  createdTimestamp: string;
  tags: string[];
  links: ProfileLink[];
  backgroundImages: BackgroundImage[];
  profileImages: ProfileImage[];
  lsp5ReceivedAssets: LSP5Asset[];
  lsp12IssuedAssets: LSP12Asset[];
  following: Following[];
  followed: Followed[];
}

interface GetUniversalProfileResponse {
  Profile: UniversalProfileDetails[];
}

interface AppDetailPageProps {
  app: App;
  onBack: () => void;
}

export default function AppDetailPage({ app, onBack }: AppDetailPageProps) {
  const { sections, setSections } = useGrid();
  const { accounts, client: upClient } = useUpProvider();
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [publisherData, setPublisherData] = useState<UniversalProfileDetails | null>(null);
  const [isLoadingPublisher, setIsLoadingPublisher] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { 
    handleInstall, 
    handleUninstall, 
    isInstalling, 
    isUninstalling, 
    isInstalled,
    showGridSelection,
    setShowGridSelection,
    pendingApp,
    handleGridSelect,
    handleGridSelectionCancel
  } = useInstallApp();

  useEffect(() => {
    // Fetch profile data if universal profile is available
    if (app.publisherProfile && typeof app.publisherProfile === 'string') {
      fetchProfileData(app.publisherProfile);
    }
  }, [app]);

  const fetchProfileData = async (profileId: string) => {
    setIsLoadingPublisher(true);
    try {
      const { data } = await apolloClient.query<GetUniversalProfileResponse>({
        query: GET_UNIVERSAL_PROFILE,
        variables: { profileAddress: profileId }
      });
      
      if (data && data.Profile && data.Profile.length > 0) {
        const profile = data.Profile[0];
        // Convert IPFS URLs in profile data
        const processedProfile = {
          ...profile,
          profileImages: profile.profileImages?.map((img: ProfileImage) => ({
            ...img,
            url: convertIpfsUrl(img.url)
          })),
          backgroundImages: profile.backgroundImages?.map((img: BackgroundImage) => ({
            ...img,
            url: convertIpfsUrl(img.url)
          }))
        };
        setPublisherData(processedProfile);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoadingPublisher(false);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setOpenImageViewer(true);
  };

  const closeLightbox = () => {
    setOpenImageViewer(false);
  };

  const goToPreviousImage = () => {
    if (!app?.app.previewImages) return;
    setCurrentImageIndex((prev) => (prev === 0 ? app.app.previewImages.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    if (!app?.app.previewImages) return;
    setCurrentImageIndex((prev) => (prev === app.app.previewImages.length - 1 ? 0 : prev + 1));
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!openImageViewer) return;
      
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        goToPreviousImage();
      } else if (e.key === "ArrowRight") {
        goToNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openImageViewer, app]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Header with back button */}
      <header className="sticky top-0 z-10 bg-white flex items-center border-b border-gray-200">
        <button 
          onClick={onBack}
          className="py-1 rounded-full flex items-center gap-2"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-lg font-roboto">Back</span>
        </button>
      </header>

      <main className="flex-1 pb-10">
        {/* App Header Section */}
        <div className="pt-4 flex">
          <div className="relative h-20 w-20 rounded-xl overflow-hidden mr-4">
            <Image 
              src={app.icon || ""} 
              alt={app.app.name}
              fill
              quality={95}
              className="object-contain"
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold font-roboto mb-1">{app.app.name}</h1>
            <p className="text-sm text-blue-600 mb-1">{app.developer}</p>
          </div>
        </div>

        {/* Downloads & Size Info 
        <div className="flex mb-4">
          {app.downloads && (
            <div className="mr-6">
              <p className="font-medium text-center">{app.downloads}</p>
              <p className="text-xs text-gray-600">Downloads</p>
            </div>
          )}
        </div>*/}

        {/* Install/Uninstall Button */}
        <div className="my-4">
          <Button 
            className={`w-full h-10 rounded-md relative disabled:opacity-50 ${
              isInstalled(app) 
                ? 'bg-white text-blue-600 border border-gray-200 hover:bg-gray-50' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isInstalled(app)) {
                handleUninstall(app);
              } else {
                handleInstall(app);
              }
            }}
            disabled={isInstalling || isUninstalling}
          >
            {isInstalling || isUninstalling ? (
              <div className="flex items-center justify-center gap-2">
                <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                  isInstalled(app) ? 'border-blue-600' : 'border-white'
                }`} />
                <span>{isUninstalling ? "Uninstalling..." : "Installing..."}</span>
              </div>
            ) : (
              isInstalled(app) ? "Uninstall" : "Install"
            )}
          </Button>
        </div>

        {/* Screenshots Carousel */}
        {app.app.previewImages && app.app.previewImages.length > 0 && (
          <div className="mt-6 mb-2">
            <Carousel 
              opts={{
                align: "start",
                loop: false,
                skipSnaps: false,
                containScroll: "trimSnaps"
              }}
              className="w-full mb-4"
            >
              <CarouselContent className="pt-1 -ml-4 flex flex-row">
                {app.app.previewImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-4 basis-[140px] h-[200px] shrink-0">
                    <div 
                      className="relative h-full w-[120px] overflow-hidden rounded-xl cursor-pointer border border-gray-200"
                      onClick={() => openLightbox(index)}
                    >
                      <Image 
                        src={image} 
                        alt={`${app.app.name} screenshot ${index + 1}`}
                        fill
                        quality={90}
                        sizes="120px"
                        className="object-contain"
                        priority={index < 3}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}

        {/* About this app */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium font-roboto">About this app</h2>
          </div>
          <div className="relative">
            <p className={`text-sm text-gray-700 ${isDescriptionExpanded ? '' : 'line-clamp-4'}`}>
              {/* For now using legacy field, will need to fetch from profile later */}
              {app.developer ? `Built by ${app.developer}` : "No description available"}
            </p>
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-blue-600 text-sm font-medium mt-1 hover:text-blue-700"
            >
              {isDescriptionExpanded ? 'See less' : 'See more'}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {app.categories.map((category, index) => (
              <span key={index} className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* About the publisher */}
        <div className="mb-6 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium font-roboto">About the publisher</h2>
          </div>
          
          {isLoadingPublisher ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start">
                <div className="h-12 w-12 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-3"></div>
                </div>
              </div>
              
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
              
              <div className="flex gap-2 mt-1">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-start">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage 
                    src={publisherData?.profileImages && publisherData.profileImages.length > 0 
                      ? publisherData.profileImages[0].url
                      : app?.icon || ""} 
                    alt={publisherData?.name || app?.developer || ""}
                    className="object-contain"
                  />
                  <AvatarFallback>{app?.developer?.substring(0, 2) || "UP"}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium text-base mr-2">
                      {publisherData?.name || app?.developer || ""}
                    </h3>
                    <span className="text-xs text-gray-600">
                      {publisherData?.followed?.length || "0"} followers
                    </span>
                  </div>
                  
                  {publisherData?.createdTimestamp && (
                    <p className="text-xs text-gray-500 mb-1">
                      Joined {new Date(Number(publisherData.createdTimestamp) * 1000).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short'
                      })}
                    </p>
                  )}
                </div>
              </div>
              
              {publisherData?.description && (
                <p className="text-sm text-gray-700 line-clamp-4">
                  {publisherData.description}
                </p>
              )}
              
              {/* Links - Only render if links exist */}
              {publisherData?.links && publisherData.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {publisherData.links.map((link, index) => (
                    <Button key={index} variant="outline" size="sm" className="h-8 px-3 text-xs" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        {link.title || "Link"} <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Full-screen Image Viewer */}
      {openImageViewer && app.app.previewImages && app.app.previewImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          {/* Image container with smaller bounded size */}
          <div className="relative bg-white rounded-lg overflow-hidden max-w-[85%] max-h-[85vh] w-auto shadow-xl">
            {/* Close button */}
            <button 
              onClick={closeLightbox}
              className="absolute top-2 left-2 bg-gray-700 text-white p-1.5 rounded-full z-50 hover:bg-black transition-all duration-200 ease-in-out"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={app.app.previewImages[currentImageIndex]}
                alt={`${app.app.name} screenshot ${currentImageIndex + 1}`}
                className="object-contain"
                width={275}
                height={800}
                quality={100}
                priority
              />
            </div>

            {/* Image counter */}
            <div className="absolute bottom-3 left-0 right-0 text-center text-black text-sm">
              {currentImageIndex + 1} / {app.app.previewImages.length}
            </div>
          </div>

          {/* Navigation arrows - moved outside the card */}
          <button 
            onClick={goToPreviousImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 p-2 rounded-full bg-white bg-opacity-80 hover:bg-white transition-all duration-200 ease-in-out"
            aria-label="Previous image"
          >
            <ArrowLeft size={24} />
          </button>
          
          <button 
            onClick={goToNextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-800 p-2 rounded-full bg-white bg-opacity-80 hover:bg-white transition-all duration-200 ease-in-out"
            aria-label="Next image"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      )}

      {/* Grid Selection Dialog */}
      <GridSelectionDialog
        open={showGridSelection}
        onOpenChange={setShowGridSelection}
        sections={sections}
        appName={app.app.name}
        onGridSelect={handleGridSelect}
        onCancel={handleGridSelectionCancel}
      />
    </div>
  );
} 