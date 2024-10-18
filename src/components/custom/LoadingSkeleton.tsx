import { Loader2 } from "lucide-react";
import React from "react";

const LoadingSkeleton = () => {
  return (
    <div>
      <div className=" flex flex-col justify-center gap-5 items-center h-screen w-screen">
        <Loader2 className=" animate-spin " />
        <div className="text-white">OnBoarding the most powerful Canvas</div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
