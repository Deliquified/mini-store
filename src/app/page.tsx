"use client";

import StoreExperience from "@/components/StoreExperience";

export default function Home() {
  // Full store on BOTH desktop and inside the UP grid.
  // Context (grid vs standalone) is detected at runtime inside StoreExperience.
  return <StoreExperience variant="auto" />;
}
