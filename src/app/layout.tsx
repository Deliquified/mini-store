import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { Providers } from "./components/providers/providers";

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
  title: "LUKSO App Store",
  description:
    "Discover and launch apps for your Universal Profile. Browse the LUKSO App Store anywhere, or add apps directly to your Grid.",
  icons: {
    icon: "/favicon.ico",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={`${inter.variable} ${display.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
