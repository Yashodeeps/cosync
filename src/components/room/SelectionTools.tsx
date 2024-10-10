"use client";
import React, { memo } from "react";

import { Camera, Color } from "@/types/canvas";
import { useSelf } from "@liveblocks/react";
import useSelectionBounds from "@/hooks/useSelectionBounds";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((self) => self.presence.selection);

    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) {
      return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
      <div
        className="absolute p-3 rounded-xl bg-gray-700 shadow-sm border flex select-none "
        style={{
          transform: `translate(
                calc(${x}px - 50%),
                calc(${y - 16}px - 100%)
            )`,
        }}
      >
        SelectionTools
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";

export default SelectionTools;
