"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/custom/Navbar";
import SideMenu from "@/components/custom/SideMenu";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen">
      <Provider store={store}>
        <Navbar />
        {children}
      </Provider>
    </div>
  );
}
