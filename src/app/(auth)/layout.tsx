import Navbar from "@/components/custom/Navbar";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800  to-black">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
