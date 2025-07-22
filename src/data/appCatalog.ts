/*For now for simplicity we've apps locally in our data folder.
In the future we will use a database and a backend to store and serve apps.*/

// Defolio Multisend
import defolioMultisend from "./icons/defolio-multisend/logo.webp";
import defolioMultisendBanner from "./icons/defolio-multisend/banner.jpg";
import defolioMultisendScreenshot1 from "./icons/defolio-multisend/image_1.png";
import defolioMultisendScreenshot2 from "./icons/defolio-multisend/image_2.png";
import defolioMultisendScreenshot3 from "./icons/defolio-multisend/image_3.png";
import defolioMultisendScreenshot4 from "./icons/defolio-multisend/image_4.png";
import defolioMultisendScreenshot5 from "./icons/defolio-multisend/image_5.png";

// Stakingverse Staking
import stakingverseStaking from "./icons/stakingverse-staking/logo.jpg"
import stakingverseStakingBanner from "./icons/stakingverse-staking/banner.jpg"
import stakingverseStakingScreenshot1 from "./icons/stakingverse-staking/image_1.png"
import stakingverseStakingScreenshot2 from "./icons/stakingverse-staking/image_2.png"

// Deliquified Roasted
import deliquifiedRoasted from "./icons/roasted/logo.png"
import deliquifiedRoastedBanner from "./icons/roasted/banner.png"
import deliquifiedRoastedScreenshot1 from "./icons/roasted/image_1.png"
import deliquifiedRoastedScreenshot2 from "./icons/roasted/image_2.png"
import deliquifiedRoastedScreenshot3 from "./icons/roasted/image_3.png"
import deliquifiedRoastedScreenshot4 from "./icons/roasted/image_4.png"
import deliquifiedRoastedScreenshot5 from "./icons/roasted/image_5.png"
import deliquifiedRoastedScreenshot6 from "./icons/roasted/image_6.png"

// Dracos
import dracos from "./icons/aratta-labs-draco/logo.png"
import dracosBanner from "./icons/aratta-labs-draco/banner.png"
import dracosScreenshot1 from "./icons/aratta-labs-draco/image_1.png"
import dracosScreenshot2 from "./icons/aratta-labs-draco/image_2.png"

// Pigmint
import pigmint from "./icons/aratta-labs-pigmint/logo.png"
import pigmintBanner from "./icons/aratta-labs-pigmint/banner.png"
import pigmintScreenshot1 from "./icons/aratta-labs-pigmint/image_1.png"
import pigmintScreenshot2 from "./icons/aratta-labs-pigmint/image_2.png"
import pigmintScreenshot3 from "./icons/aratta-labs-pigmint/image_3.png"

// Stakingverse Holders
import holders from "./icons/stakingverse-holders/logo.jpg"
import holdersBanner from "./icons/stakingverse-holders/banner.jpg"
import holdersScreenshot1 from "./icons/stakingverse-holders/image_1.png"

// Stakingverse TVL
import tvl from "./icons/stakingverse-tvl/logo.jpg"
import tvlBanner from "./icons/stakingverse-tvl/banner.jpg"
import tvlScreenshot1 from "./icons/stakingverse-tvl/image_1.png"

// Stakingverse Dashboard
import dashboard from "./icons/stakingverse-dashboard/logo.jpg"
import dashboardBanner from "./icons/stakingverse-dashboard/banner.jpg"
import dashboardScreenshot1 from "./icons/stakingverse-dashboard/image_1.png"

// Notes
import notes from "./icons/deliquified-notes/logo.png"
import notesBanner from "./icons/deliquified-notes/background.png"
import notesScreenshot1 from "./icons/deliquified-notes/image_1.png"
import notesScreenshot2 from "./icons/deliquified-notes/image_2.png"

// App Types and Interfaces
export interface App {
  categories: string[];
  publisherProfile: string;
  app: {
    profile: string;
    name: string;
    url: string;
    sourceCode?: string;
    defaultGridSize: {
      width: number;
      height: number;
    };
    previewImages: string[];
  };
  
  // Legacy fields for backward compatibility (will be removed later)
  id?: string;
  icon?: string;
  banner?: string;
  developer?: string;
  tags?: string[];
  featured?: boolean;
}

export interface FeaturedApp extends App {
  title: string;
  banner: string;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
}

// All apps in the store
export const apps: Record<string, App> = {
  "defolio-multisend": {
    categories: ["DeFi", "Infrastructure"],
    publisherProfile: "0x746a88d4bc09562e3f01bf4bd0ec91233f67e0d5",
    app: {
      profile: "0x746a88d4bc09562e3f01bf4bd0ec91233f67e0d5",
      name: "Multisend: Send Tokens & NFTs",
      url: "https://multisend-alpha.vercel.app/",
      sourceCode: "https://github.com/deliquified/multisend",
      defaultGridSize: {
        width: 1,
        height: 2
      },
      previewImages: [
        defolioMultisendScreenshot1.src,
        defolioMultisendScreenshot2.src,
        defolioMultisendScreenshot3.src,
        defolioMultisendScreenshot4.src,
        defolioMultisendScreenshot5.src
      ]
    },
    // Legacy fields
    id: "defolio-multisend",
    icon: defolioMultisend.src,
    banner: defolioMultisendBanner.src,
    developer: "Deliquified Labs",
    featured: true
  },
  "stakingverse-staking": {
    categories: ['DeFi', 'Staking'],
    publisherProfile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
    app: {
      profile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
      name: "Stakingverse: Stake Your LYX",
      url: 'https://app.stakingverse.io/staking-widget',
      defaultGridSize: {
        width: 1,
        height: 1
      },
      previewImages: [
        stakingverseStakingScreenshot1.src,
        stakingverseStakingScreenshot2.src
      ]
    },
    // Legacy fields
    id: "stakingverse-staking",
    icon: stakingverseStaking.src,
    banner: stakingverseStakingBanner.src,
    developer: 'Stakingverse',
    featured: true
  },
  "deliquified-roasted": {
    categories: ['Social'],
    publisherProfile: '0x746a88d4bc09562e3f01bf4bd0ec91233f67e0d5',
    app: {
      profile: '0x746a88d4bc09562e3f01bf4bd0ec91233f67e0d5',
      name: "Roasted: Roast Profiles",
      url: 'https://roasted-green.vercel.app/',
      defaultGridSize: {
        width: 1,
        height: 1
      },
      previewImages: [
        deliquifiedRoastedScreenshot1.src,
        deliquifiedRoastedScreenshot2.src,
        deliquifiedRoastedScreenshot3.src,
        deliquifiedRoastedScreenshot4.src,
        deliquifiedRoastedScreenshot5.src,
        deliquifiedRoastedScreenshot6.src
      ]
    },
    // Legacy fields
    id: "deliquified-roasted",
    icon: deliquifiedRoasted.src,
    banner: deliquifiedRoastedBanner.src,
    developer: 'Deliquified Labs',
    featured: true
  },
  "aratta-labs-draco": {
    categories: ['NFTs'],
    publisherProfile: '0x8A985fe01eA908F5697975332260553c454f8F77',
    app: {
      profile: '0x8A985fe01eA908F5697975332260553c454f8F77',
      name: "Dracos: Swipe & Mint",
      url: 'https://thunder-dracos.vercel.app',
      defaultGridSize: {
        width: 1,
        height: 2
      },
      previewImages: [
        dracosScreenshot1.src,
        dracosScreenshot2.src,
      ]
    },
    // Legacy fields
    id: "aratta-labs-draco",
    icon: dracos.src,
    banner: dracosBanner.src,
    developer: 'Aratta Labs',
    featured: true
  },
  "aratta-labs-pigmint": {
    categories: ['Social', "NFTs"],
    publisherProfile: '0x544051588d6a0713e164196c16024fdcff877540',
    app: {
      profile: '0x544051588d6a0713e164196c16024fdcff877540',
      name: "Pigmint: Mint Your Mood",
      url: 'https://pigmint.vercel.app/',
      defaultGridSize: {
        width: 2,
        height: 2
      },
      previewImages: [
        pigmintScreenshot1.src,
        pigmintScreenshot2.src,
        pigmintScreenshot3.src,
      ]
    },
    // Legacy fields
    id: "aratta-labs-pigmint",
    icon: pigmint.src,
    banner: pigmintBanner.src,
    developer: 'Aratta Labs',
    featured: true
  },
  "stakingverse-holders": {
    categories: ["DeFi", "Staking", "Community", "Social"],
    publisherProfile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
    app: {
      profile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
      name: "Stakingverse: Holders",
      url: 'https://app.stakingverse.io/holders-widget',
      defaultGridSize: {
        width: 1,
        height: 2
      },
      previewImages: [
        holdersScreenshot1.src,
      ]
    },
    // Legacy fields
    id: "stakingverse-holders",
    icon: holders.src,
    banner: holdersBanner.src,
    developer: 'Stakingverse',
    featured: true
  },
  "stakingverse-tvl": {
    categories: ["DeFi", "Staking"],
    publisherProfile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
    app: {
      profile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
      name: "Stakingverse: Track TVL",
      url: 'https://stakingverse.io/tvl-widget',
      defaultGridSize: {
        width: 1,
        height: 2
      },
      previewImages: [
        tvlScreenshot1.src,
      ]
    },
    // Legacy fields
    id: "stakingverse-tvl",
    icon: tvl.src,
    banner: tvlBanner.src,
    developer: 'Stakingverse',
    featured: true
  },
  "stakingverse-dashboard": {
    categories: ["DeFi", "Staking"],
    publisherProfile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
    app: {
      profile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
      name: "Stakingverse: Dashboard",
      url: 'https://stakingverse.io/dashboard',
      defaultGridSize: {
        width: 1,
        height: 2
      },
      previewImages: [
        dashboardScreenshot1.src,
      ]
    },
    // Legacy fields
    id: "stakingverse-dashboard",
    icon: dashboard.src,
    banner: dashboardBanner.src,
    developer: 'Stakingverse',
    featured: true
  },
  "deliquified-notes": {
    categories: ["Social", "Infrastructure"],
    publisherProfile: '0x746a88d4bc09562e3f01bf4bd0ec91233f67e0d5',
    app: {
      profile: '0x746a88d4bc09562e3f01bf4bd0ec91233f67e0d5',
      name: "Notes: Take Notes Privately",
      url: 'https://mini-notes-livid.vercel.app/',
      defaultGridSize: {
        width: 2,
        height: 2
      },
      previewImages: [
        notesScreenshot1.src,
        notesScreenshot2.src,
      ]
    },
    // Legacy fields
    id: "deliquified-notes",
    icon: notes.src,
    banner: notesBanner.src,
    developer: 'Deliquified Labs',
    featured: true
  },
};

// Categories definition
export const categories: Record<string, Category> = {
  "Art": {
    id: "Art",
    name: "Art",
    displayName: "Art"
  },
  "AI": {
    id: "AI",
    name: "AI",
    displayName: "AI"
  },
  "Brands": {
    id: "Brands",
    name: "Brands",
    displayName: "Brands"
  },
  "Community": {
    id: "Community",
    name: "Community",
    displayName: "Community"
  },
  "DAOs": {
    id: "DAOs",
    name: "DAOs",
    displayName: "DAOs"
  },
  "DeFi": {
    id: "DeFi",
    name: "DeFi",
    displayName: "DeFi"
  },
  "Exchanges": {
    id: "Exchanges",
    name: "Exchanges",
    displayName: "Exchanges"
  },
  "Fashion": {
    id: "Fashion",
    name: "Fashion",
    displayName: "Fashion"
  },
  "Gaming": {
    id: "Gaming",
    name: "Gaming",
    displayName: "Gaming"
  },
  "Infrastructure": {
    id: "Infrastructure",
    name: "Infrastructure",
    displayName: "Infrastructure"
  },
  "Marketplaces": {
    id: "Marketplaces",
    name: "Marketplaces",
    displayName: "Marketplaces"
  },
  "Music": {
    id: "Music",
    name: "Music",
    displayName: "Music"
  },
  "NFTs": {
    id: "NFTs",
    name: "NFTs",
    displayName: "NFTs"
  },
  "Security": {
    id: "Security",
    name: "Security",
    displayName: "Security"
  },
  "Social": {
    id: "Social",
    name: "Social",
    displayName: "Social"
  },
  "Staking": {
    id: "Staking",
    name: "Staking",
    displayName: "Staking"
  }
};

// Featured apps
export const featuredApps: FeaturedApp[] = [
  {
    ...apps["defolio-multisend"],
    title: "Send Tokens & NFTs",
    banner: apps["defolio-multisend"].banner || ""
  }
];

// Sample categories for display
export const sampleCategories = [
  "Social",
  "AI",
  "Gaming",
  "DeFi",
  "NFTs"
];

// Helper functions to retrieve data
export const getAppsByCategory = (categoryId: string): App[] => {
  // Return all apps that have this category in their categories array
  return Object.values(apps).filter(app => app.categories.includes(categoryId));
};

// Get the primary category (first in the array) of an app
export const getPrimaryCategory = (app: App): string => {
  return app.categories[0] || "";
};

export const getFeaturedApps = (): FeaturedApp[] => {
  return featuredApps;
};

export const getTopCategories = (): Category[] => {
  return sampleCategories.map(id => categories[id]).filter(Boolean);
};