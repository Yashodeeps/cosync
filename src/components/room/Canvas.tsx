import React from "react";
import RoomHeader from "./RoomHeader";
import ToolBar from "./ToolBar";

const Canvas = () => {
  return (
    <div className="h-full w-full touch-none">
      <RoomHeader />
      <ToolBar />
    </div>
  );
};

export default Canvas;
