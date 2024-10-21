"use client";

//TODO: infoskeleton, toolbar skeleton, participant skeleton, and loading component and add them all into a single loading component
//todo: add tooltip to the logo
//todo: add rename model for rooms
//todo: actions menu: share, copy, download

import React from "react";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
interface RoomHeaderProps {
  roomId: string;
  roomInfo: any;
}

const RoomHeader = ({ roomId, roomInfo }: RoomHeaderProps) => {
  const router = useRouter();



  return (
    <div className="absolute z-50 top-2 left-2 bg-gray-800  gap-3 rounded-md px-2 py-2 text-zinc-100 flex items-center shadow-md ">
      <div className="w-full hover:bg-gray-700 p-1.5 rounded-sm ">
        <div
          className="font-semibold cursor-pointer text-lg"
          onClick={() => {
            router.push("/projects");
          }}
        >
          logo Room
        </div>
      </div>
      <Separator orientation="vertical" />

      <div className=" hover:bg-gray-700 p-2 rounded-sm ">
        {roomInfo && roomInfo.name}
      </div>
    </div>
  );
};

export const RoomHeaderSkeleton = () => {
  return (
    <div className="fixed z-50 top-2 left-2 bg-gray-800  gap-3 rounded-md px-2 py-2 h-12 text-zinc-100 flex items-center shadow-md animate-pulse w-48"></div>
  );
};

export default RoomHeader;
