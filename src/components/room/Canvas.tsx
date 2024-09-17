"use client";

import React from "react";
import RoomHeader from "./RoomHeader";
import ToolBar from "./ToolBar";
import { useOthers } from "@liveblocks/react/suspense";

interface CanvasProps {
  roomId: string;
}

const Canvas = ({ roomId }: CanvasProps) => {
  const others = useOthers();
  const userCount = others.length;
  return (
    <div className="h-full w-full touch-none flex justify-center items-center">
      <RoomHeader />
      <ToolBar />
      <div>There are {userCount} other user(s) online</div>;
    </div>
  );
};

export default Canvas;
