import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import { Providers } from "./components/providers/providers";
import logo from "../../public/squirrel.svg";

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Mini Store",
  description: "Your friendly neighborhood app store for Universal Profile mini-apps",
  icons: {
    icon: logo.src
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
