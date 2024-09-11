import React from "react";
import { Separator } from "../ui/separator";

const RoomCard = ({ title }: { title: string }) => {
  return (
    <div className="border w-56 h-56 my-4 shadow-lg bg-gray-950 hover:bg-gray-900 cursor-pointer border-gray-600 rounded-lg p-4">
      <div className="h-36"></div>
      <Separator className="border-gray-200" />
      <h1 className="p-4">{title}</h1>
    </div>
  );
};

export default RoomCard;
