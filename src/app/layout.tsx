import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/Providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "cosync",
  description: "A realtime digital workspace, simplified",
  openGraph: {
    title: "cosync",
    description: "A realtime digital workspace, simplified",
    type: "website",
    url: "https://cosynclabs.com",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "cosync",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" h-screen max-h-screen">
          <Providers>{children}</Providers>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
