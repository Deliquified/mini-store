import type { Metadata } from "next";
import { notFound } from "next/navigation";

import StoreDirectoryExperience from "@/components/StoreDirectoryExperience";
import { apps } from "@/data/appCatalog";

interface StoreAppPageProps {
  params: Promise<{
    appId: string;
  }>;
}

export function generateStaticParams() {
  return Object.values(apps).flatMap((app) => {
    if (!app.id) return [];
    return [{ appId: app.id }];
  });
}

export async function generateMetadata({
  params,
}: StoreAppPageProps): Promise<Metadata> {
  const { appId } = await params;
  const app = apps[appId];

  if (!app) {
    return {
      title: "App not found | LUKSO UP!Store",
    };
  }

  const description = [
    app.developer || app.publisherProfile,
    app.categories.slice(0, 3).join(", "),
  ]
    .filter(Boolean)
    .join(" - ");

  return {
    title: `${app.app.name} | LUKSO UP!Store`,
    description: description || "Discover this app on the LUKSO UP!Store.",
    openGraph: {
      title: `${app.app.name} | LUKSO UP!Store`,
      description: description || "Discover this app on the LUKSO UP!Store.",
      images: app.banner ? [app.banner] : app.icon ? [app.icon] : [],
    },
  };
}

export default async function StoreAppPage({ params }: StoreAppPageProps) {
  const { appId } = await params;

  if (!apps[appId]) {
    notFound();
  }

  return <StoreDirectoryExperience initialAppId={appId} />;
}
