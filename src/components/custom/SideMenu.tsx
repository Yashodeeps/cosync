"use client";

import React from "react";

const SideMenu = () => {
  return (
    <div className="p-4 m-4 border border-gray-700 shadow-lg rounded-lg h-full text-gray-200 ">
      <ul>
        <li className="text-xl  p-4">Home</li>
        <li className="text-xl  p-4">About</li>
        <li className="text-xl  p-4">Services</li>
        <li className="text-xl  p-4">Contact</li>
      </ul>
    </div>
  );
};

export default SideMenu;
