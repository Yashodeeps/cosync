"use client";

//TODO: infoskeleton, toolbar skeleton, participant skeleton, and loading component and add them all into a single loading component
//todo: add tooltip to the logo
//todo: add rename model for rooms
//todo: actions menu: share, copy, download

import React from "react";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { Syne_Mono, Syne } from "next/font/google";

//use Syne for normal texts.
const font = Syne_Mono({ weight: "400", subsets: ["latin"] });
interface RoomHeaderProps {
  roomId: string;
  roomInfo: any;
}

const RoomHeader = ({ roomId, roomInfo }: RoomHeaderProps) => {
  const router = useRouter();

  return (
    <div className="absolute z-50 top-2 left-2 bg-gray-800  gap-3 rounded-md px-2 py-1  text-zinc-100 flex items-center shadow-md ">
      <div className={`w-full  p-1 rounded-sm text-xl ${font.className}`}>
        <div
          className=" cursor-pointer "
          onClick={() => {
            router.push("/projects");
          }}
        >
          <img src="/fav.png" className=" w-8 rounded-lg inline" /> cosync
        </div>
      </div>
      <Separator orientation="vertical" className="bg-black h-10 " />

      <div className=" hover:bg-gray-700 px-2 py-1.5 rounded-sm ">
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
