import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProviders";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoSyncLabs",
  description: "Collab, build and network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-zinc-900 h-screen max-h-screen">
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
