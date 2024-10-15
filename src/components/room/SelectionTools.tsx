"use client";
import React, { memo } from "react";

import { Camera, Color } from "@/types/canvas";
import { useMutation, useSelf } from "@liveblocks/react";
import useSelectionBounds from "@/hooks/useSelectionBounds";
import ColorPicker from "./ColorPicker";
import useDeleteLayers from "@/hooks/useDeleteLayers";
import { Button } from "../ui/button";
import { BringToFront, icons, SendToBack, Trash2 } from "lucide-react";
import { Separator } from "../ui/separator";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((self) => self.presence?.selection ?? []);

    const moveToBack = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection && selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = 0; i < indices.length; i++) {
          liveLayerIds.move(indices[i], i);
        }
      },
      [selection]
    );

    const moveToFront = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection && selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
          liveLayerIds.move(
            indices[i],
            arr.length - 1 - (indices.length - 1 - i)
          );
        }
      },
      [selection]
    );

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
        <div className="flex flex-col gap-1">
          <Button
            className="bg-transparent hover:bg-gray-300 text-white hover:text-black"
            size={"icon"}
            onClick={moveToFront}
          >
            <BringToFront />
          </Button>
          <Button
            className="bg-transparent hover:bg-gray-300 text-white hover:text-black"
            size={"icon"}
            onClick={moveToBack}
          >
            <SendToBack />
          </Button>
        </div>
        <div className="flex items-center pl-2 ml-2 border-l border-gray-200">
          <Button
            variant={"destructive"}
            className="bg-transparent"
            size={"icon"}
            onClick={deleteLayers ?? undefined}
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
