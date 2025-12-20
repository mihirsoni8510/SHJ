import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "@/components/providers";
import LayoutContent from "@/components/LayoutContent";

export const metadata: Metadata = {
  title: "Shree Harikrupa Jewellers - Exquisite Jewelry Collection",
  description: "Discover timeless elegance with our handcrafted gold, diamond, and silver jewelry. Premium quality jewelry for every occasion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <LayoutContent>
            {children}
          </LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
