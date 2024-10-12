"use client";
import React, { memo } from "react";

import { Camera, Color } from "@/types/canvas";
import { useMutation, useSelf } from "@liveblocks/react";
import useSelectionBounds from "@/hooks/useSelectionBounds";
import ColorPicker from "./ColorPicker";
import useDeleteLayers from "@/hooks/useDeleteLayers";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((self) => self.presence.selection);

    const setFill = useMutation(
      ({ storage }, fill: Color) => {
        const liveLayers = storage.get("layers");
        setLastUsedColor(fill);

        selection?.forEach((layerId) => {
          liveLayers.get(layerId)?.set("color", fill);
        });
      },
      [selection, setLastUsedColor]
    );

    const deleteLayers = useDeleteLayers();

    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) {
      return null;
    }

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (
      <div
        className="absolute p-3 rounded-xl bg-gray-800 shadow-sm border flex select-none "
        style={{
          transform: `translate(
                calc(${x}px - 50%),
                calc(${y - 16}px - 100%)
            )`,
        }}
      >
        <ColorPicker onChange={setFill} />
        <div className="flex flex-col gap-1"></div>
        <div className="flex items-center pl-2 ml-2 border-l border-gray-200">
          <Button
            variant={"destructive"}
            size={"icon"}
            onClick={deleteLayers || undefined}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";

export default SelectionTools;
