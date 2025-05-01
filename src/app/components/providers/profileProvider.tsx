'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUpProvider } from "./upProvider";
import { useQuery } from "@apollo/client";
import { GET_UNIVERSAL_PROFILE } from "../apollo/query";
import React from "react";

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

interface ProfileLink {
  title: string;
  url: string;
}

interface BackgroundImage {
  width: number;
  height: number;
  url: string;
  verified: boolean;
  method: string;
  data: string;
}

interface ProfileImage {
  url: string;
}

interface Asset {
  id: string;
}

interface FollowProfile {
  id: string;
  name: string;
  description: string;
  tags: string[];
  links: ProfileLink[];
  backgroundImages: { url: string }[];
  profileImages: { url: string }[];
}

interface Following {
  followee: FollowProfile;
}

interface Followed {
  follower: FollowProfile;
}

interface ProfileData {
  id: string;
  name: string;
  description: string;
  createdTimestamp: string;
  tags: string[];
  links: ProfileLink[];
  backgroundImages: BackgroundImage[];
  profileImages: ProfileImage[];
  lsp5ReceivedAssets: { asset: Asset }[];
  lsp12IssuedAssets: { asset: Asset }[];
  following: Following[];
  followed: Followed[];
}

interface ProfileContextType {
  profileData: ProfileData | null;
  isLoading: boolean;
  error: string | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { accounts } = useUpProvider();
  const { data, loading, error } = useQuery(GET_UNIVERSAL_PROFILE, {
    variables: { profileAddress: accounts?.[0] || "" },
    skip: !accounts?.[0]
  });

  // Convert IPFS URLs in profile data
  const processedData = React.useMemo(() => {
    if (!data?.Profile?.[0]) return null;
    
    const profile = data.Profile[0];
    return {
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
  }, [data]);

  const value = {
    profileData: processedData,
    isLoading: loading,
    error: error?.message || null
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}