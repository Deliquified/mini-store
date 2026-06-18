import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Providers } from "./components/providers/providers";
import { siteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "LUKSO UP!Store",
  description:
    "Discover and launch apps for your Universal Profile. Browse the LUKSO UP!Store anywhere, or add apps directly to your Grid.",
  icons: {
    icon: "/up-logo.png",
    apple: "/up-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1014" },
  ],
};

// SSR-safe theme bootstrap: sets .dark on <html> before paint to avoid FOUC.
// classList mutation is invisible to React hydration (no markup branching on theme).
// Light is the default — dark only applies when the user has explicitly chosen it.
const themeBootstrap = `(function(){try{var d=localStorage.getItem('theme')==='dark';var c=document.documentElement.classList;d?c.add('dark'):c.remove('dark');}catch(e){}})();`;

// Site-wide structured data (machine/agent readability). Per-app
// SoftwareApplication data is added on each /store/[appId] page.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "LUKSO UP!Store",
      url: siteUrl,
      logo: `${siteUrl}/up-logo.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "LUKSO UP!Store",
      description:
        "Discover Mini-Apps for your LUKSO Universal Profile. Open any app, or add it to your Universal Profile Grid.",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${display.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
