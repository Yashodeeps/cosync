import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/custom/Navbar";
import SideMenu from "@/components/custom/SideMenu";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <div className="h-[37rem] sm:hidden md:block md:w-1/4 lg:w-1/5 flex ">
        <SideMenu />
      </div>{" "}
      {children}
    </div>
  );
}
