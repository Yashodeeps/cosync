"use client";
import Navbar from "@/components/custom/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen">
      {/* <Navbar /> */}
      <div className="">{children}</div>
    </div>
  );
}
