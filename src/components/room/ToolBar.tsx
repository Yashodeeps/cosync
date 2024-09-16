import React from "react";

const ToolBar = () => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-gray-800 rounded-md p-2 flex gap-1 flex-col items-center shadow-md">
        <div>some</div>
        <div>tools</div>
        <div>goes</div>
        <div>heree</div>
      </div>{" "}
      <div className="bg-gray-800 rounded-md p-2 flex gap-1 flex-col items-center shadow-md">
        <div>unde</div>
        <div>redo</div>
      </div>{" "}
    </div>
  );
};

export default ToolBar;
