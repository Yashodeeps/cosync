import React from "react";

const SideMenu = () => {
  return (
    <div className="p-4 m-4 border border-gray-700 shadow-lg rounded-lg h-full text-gray-200 ">
      <ul>
        <li className="text-xl  p-4">Dashboard</li>
        <li className="text-xl  p-4">Workspaces</li>
        <li className="text-xl  p-4">Feed</li>
        <li className="text-xl  p-4">Collab</li>
      </ul>
    </div>
  );
};

export default SideMenu;
