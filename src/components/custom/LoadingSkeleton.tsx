import { Loader2 } from "lucide-react";
import React from "react";
import { RoomHeaderSkeleton } from "../room/RoomHeader";

const LoadingSkeleton = () => {
  return (
    <div className=" justify-center gap-5 items-center h-screen w-screen relative flex">
      <Loader2 className=" animate-spin " />
      <RoomHeaderSkeleton />
    </div>
  );
};

export default LoadingSkeleton;
