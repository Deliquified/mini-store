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
  id: string;
  name: string;
  icon: string;
  banner: string;
  categories: string[];
  subCategory?: string;
  developer: string;
  size?: string;
  downloads?: string;
  tags?: string[];
  
  // New required fields
  universalProfile: string;
  appName: string;
  appIcon: string;
  appAbout: string;
  appLink: string;
  appSize: {
    width: number;
    height: number;
  };
  images: string[];
  featured: boolean;
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
    id: "defolio-multisend",
    name: "Multisend",
    icon: defolioMultisend.src,
    banner: defolioMultisendBanner.src,
    categories: ["DeFi", "Infrastructure"],
    developer: "Deliquified Labs",
    tags: ["defi", "multisend", "defolio", "portfolio", "wallet"],

    universalProfile: "0x746a88d4bc09562e3f01bf4bd0ec91233f67e0d5",
    appName: "Multisend: Send Tokens & NFTs",
    appIcon: defolioMultisend.src,
    appAbout: "Defolio's flagship feature - Multisend is a simple way to send tokens, NFTs and collections to recipients with ease. No more selecting each token and sending them one by one. Multisend allows you to send multiple tokens and NFTs at once, with a single click. Developed by Deliquified Labs.",
    appLink: "https://multisend-alpha.vercel.app/",
    appSize: {
      width: 1,
      height: 2
    },
    images: [
      defolioMultisendScreenshot1.src,
      defolioMultisendScreenshot2.src,
      defolioMultisendScreenshot3.src,
      defolioMultisendScreenshot4.src,
      defolioMultisendScreenshot5.src
    ],
    featured: true
  },
  "stakingverse-staking": {
    id: "stakingverse-staking",
    name: "Stakingverse Staking",
    icon: stakingverseStaking.src,
    banner: stakingverseStakingBanner.src,
    categories: ['DeFi', 'Staking'],
    developer: 'Stakingverse',
    tags: ['staking', 'defi', 'stakingverse', "liquid staking"],
    universalProfile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
    appName: "Stakingverse: Stake Your LYX",
    appIcon: stakingverseStaking.src,
    appAbout: "Stake your LYX tokens and earn rewards in a secure and easy way. Stakingverse's Staking Mini-App provides a secure and non-custodial platform for staking LYX on the LUKSO blockchain. The app allows users to deposit LYX into staking pools to earn rewards effortlessly, with features like auto-compounding to maximize returns. Users can stake any amount, monitor rewards through a dashboard, and withdraw funds with no lock-up period, though larger withdrawals may depend on the validator queue. Stakingverse takes a 10% fee on profits for LYX staking, ensuring transparency and reliability. The app is backed by partnerships with trusted projects like StakeWise and DIA, offering a seamless staking experience for both beginners and advanced users.",
    appLink: 'https://app.stakingverse.io/staking-widget',
    appSize: {
      width: 1,
      height: 1
    },
    images: [
      stakingverseStakingScreenshot1.src,
      stakingverseStakingScreenshot2.src
    ],
    featured: true    
  },
  "deliquified-roasted": {
    id: "deliquified-roasted",
    name: "Roasted",
    icon: deliquifiedRoasted.src,
    banner: deliquifiedRoastedBanner.src,
    categories: ['Social'],
    developer: 'Deliquified Labs',
    tags: ['roasting', 'defi', 'deliquified', "roasted"],
    universalProfile: '0x746a88d4bc09562e3f01bf4bd0ec91233f67e0d5',
    appName: "Roasted: Roast Profiles",
    appIcon: deliquifiedRoasted.src,
    appAbout: "Roasted is a simple and easy way to roast Universal Profiles on-chain! Get paid to be roasted, get paid to roast others. Create your own roast - or give Grok a hint and let him roast them for you!",
    appLink: 'https://roasted-green.vercel.app/',
    appSize: {
      width: 1,
      height: 1
    },
    images: [
      deliquifiedRoastedScreenshot1.src,
      deliquifiedRoastedScreenshot2.src,
      deliquifiedRoastedScreenshot3.src,
      deliquifiedRoastedScreenshot4.src,
      deliquifiedRoastedScreenshot5.src,
      deliquifiedRoastedScreenshot6.src
    ],
    featured: true    
  },
  "aratta-labs-draco": {
    id: "aratta-labs-draco",
    name: "Dracos",
    icon: dracos.src,
    banner: dracosBanner.src,
    categories: ['NFTs'],
    developer: 'Aratta Labs',
    tags: ['nft', 'aratta', 'draco', "nfts", "dracos", "lsp8"],
    universalProfile: '0x8A985fe01eA908F5697975332260553c454f8F77',
    appName: "Dracos: Swipe & Mint",
    appIcon: dracos.src,
    appAbout: "The Dracos Swipe Mini-App allows users to mint an LSP8 NFT collection directly within a LUKSO grid by one-click connecting their Universal Profile. With a dating app style swiping mechanism, the minter can choose to keep their newly acquired PFP or roll the dice and swipe it for another. The Dracos NFTs are generated in real time and each Draco that is swiped left on is immediately burned and replaced with a new option. The community gets to co-curate the collection in real time.",
    appLink: 'https://thunder-dracos.vercel.app',
    appSize: {
      width: 1,
      height: 2
    },
    images: [
      dracosScreenshot1.src,
      dracosScreenshot2.src,
    ],
    featured: true    
  },
  "aratta-labs-pigmint": {
    id: "aratta-labs-pigmint",
    name: "Pigmint",
    icon: pigmint.src,
    banner: pigmintBanner.src,
    categories: ['Social', "NFTs"],
    developer: 'Aratta Labs',
    tags: ['nft', 'aratta', 'pigmint', "nfts", "lsp8"],
    universalProfile: '0x544051588d6a0713e164196c16024fdcff877540',
    appName: "Pigmint: Mint Your Mood",
    appIcon: pigmint.src,
    appAbout: "🚀 Why Pigmint?\n\
    The digital world often lacks ambient, emotional context. Pigmint solves this by letting people show up on-chain in a more human way — their mood becomes part of their digital identity.\n\n\
    How can this mini-app improve the social experience in web3?\n\
    Spark ambient social interactions — moods and statuses invite comments, empathy or connection.\n\n\
    Encourage routine check-ins — small updates like mood changes create habits and drive regular visits back to The Grid.\n\n\
    Bring more life to Universal Profiles — beyond static NFTs, these dynamic avatars bring personality, movement and emotion to identity.",
    appLink: 'https://pigmint.vercel.app/',
    appSize: {
      width: 2,
      height: 2
    },
    images: [
      pigmintScreenshot1.src,
      pigmintScreenshot2.src,
      pigmintScreenshot3.src,
    ],
    featured: true    
  },
  "stakingverse-holders": {
    id: "stakingverse-holders",
    name: "Holders Leaderboard",
    icon: holders.src,
    banner: holdersBanner.src,
    categories: ["DeFi", "Staking", "Community", "Social"],
    developer: 'Stakingverse',
    tags: ['staking', 'defi', 'stakingverse', "liquid staking", "holders", "leaderboard"],
    universalProfile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
    appName: "Stakingverse: Holders",
    appIcon: holders.src,
    appAbout: "Track top sLYX holders and their staked LYX amounts. The leaderboard is updated in real time and shows the top 100 holders by staked LYX amount.",
    appLink: 'https://app.stakingverse.io/holders-widget',
    appSize: {
      width: 1,
      height: 2
    },
    images: [
      holdersScreenshot1.src,
    ],
    featured: true    
  },
  "stakingverse-tvl": {
    id: "stakingverse-tvl",
    name: "Stakingverse TVL",
    icon: tvl.src,
    banner: tvlBanner.src,
    categories: ["DeFi", "Staking"],
    developer: 'Stakingverse',
    tags: ['staking', 'defi', 'stakingverse', "liquid staking", "holders", "tvl", "total value locked"],
    universalProfile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
    appName: "Stakingverse: Track TVL",
    appIcon: tvl.src,
    appAbout: "Track the total value locked in Stakingverse. The TVL is updated in real time and shows the total value locked in Stakingverse.",
    appLink: 'https://stakingverse.io/tvl-widget',
    appSize: {
      width: 1,
      height: 2
    },
    images: [
      tvlScreenshot1.src,
    ],
    featured: true    
  },
  "stakingverse-dashboard": {
    id: "stakingverse-dashboard",
    name: "Stakingverse Dashboard",
    icon: dashboard.src,
    banner: dashboardBanner.src,
    categories: ["DeFi", "Staking"],
    developer: 'Stakingverse',
    tags: ['staking', 'defi', 'stakingverse', "liquid staking", "holders", "tvl", "total value locked"],
    universalProfile: '0x900Be67854A47282211844BbdF5Cc0f332620513',
    appName: "Stakingverse: Dashboard",
    appIcon: dashboard.src,
    appAbout: "The Stakingverse Dashboard is a comprehensive tool that provides an overview of your staked LYX on Stakingverse. It includes a your account summary, APY, staked balances, rewards, network analytics and more.",
    appLink: 'https://stakingverse.io/dashboard',
    appSize: {
      width: 1,
      height: 2
    },
    images: [
      dashboardScreenshot1.src,
    ],
    featured: true    
  },
  "deliquified-notes": {
    id: "deliquified-notes",
    name: "Notes",
    icon: notes.src,
    banner: notesBanner.src,
    categories: ["Social", "Infrastructure"],
    developer: 'Deliquified Labs',
    tags: ['notes', 'deliquified', "notes", "social", "defolio"],
    universalProfile: '0x746a88d4bc09562e3f01bf4bd0ec91233f67e0d5',
    appName: "Notes: Take Notes Privately",
    appIcon: notes.src,
    appAbout: "Notes is a simple and easy way to create and manage your private notes. It's a private note-taking app that allows you to take notes and save them to your Universal Profile. Notes follow wherever your Universal Profile goes.",
    appLink: 'https://mini-notes-livid.vercel.app/',
    appSize: {
      width: 2,
      height: 2
    },
    images: [
      notesScreenshot1.src,
      notesScreenshot2.src,
    ],
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
    title: "Send Tokens & NFTs"
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