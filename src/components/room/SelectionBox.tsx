// don't need "use client" as its parents is already client
import React, { memo } from "react";
import { LayerType, Side, XYWH } from "@/types/canvas";
import { useSelf, useStorage } from "@liveblocks/react";
import useSelectionBounds from "@/hooks/useSelectionBounds";

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}
const HANDLE_WIDTH = 8;
const PADDING = 6;

const SelectionBox = memo(
  ({ onResizeHandlePointerDown }: SelectionBoxProps) => {
    const soleLayerId = useSelf((self) =>
      self.presence.selection.length === 1 ? self.presence.selection[0] : null,
    );

    const isShowingHandles = useStorage(
      (root) =>
        soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path,
    );

    const bounds = useSelectionBounds();

    if (!bounds) {
      return null;
    }

    return (
      <>
        <rect
          className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none "
          style={{
            transform: `translate(${bounds.x - PADDING}px, ${
              bounds.y - PADDING
            }px)`,
          }}
          x={0}
          y={0}
          width={bounds.width + PADDING * 2}
          height={bounds.height + PADDING * 2}
        />
        {isShowingHandles && (
          <>
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(
            ${bounds.x - HANDLE_WIDTH / 2 - PADDING}px, 
            ${bounds.y - HANDLE_WIDTH / 2 - PADDING}px
          )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top + Side.Left, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(
            ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, 
            ${bounds.y - HANDLE_WIDTH / 2 - PADDING}px
          )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(
            ${bounds.x - HANDLE_WIDTH / 2 + bounds.width + PADDING}px, 
            ${bounds.y - HANDLE_WIDTH / 2 - PADDING}px
          )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Top + Side.Right, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(
            ${bounds.x - HANDLE_WIDTH / 2 + bounds.width + PADDING}px, 
            ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px
          )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Right, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nwse-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(
            ${bounds.x - HANDLE_WIDTH / 2 + bounds.width + PADDING}px, 
            ${bounds.y - HANDLE_WIDTH / 2 + bounds.height + PADDING}px
          )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ns-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(
            ${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, 
            ${bounds.y - HANDLE_WIDTH / 2 + bounds.height + PADDING}px
          )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "nesw-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(
            ${bounds.x - HANDLE_WIDTH / 2 - PADDING}px, 
            ${bounds.y - HANDLE_WIDTH / 2 + bounds.height + PADDING}px
          )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds);
              }}
            />
            <rect
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: "ew-resize",
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(
            ${bounds.x - HANDLE_WIDTH / 2 - PADDING}px, 
            ${bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2}px
          )`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(Side.Left, bounds);
              }}
            />
          </>
        )}
      </>
    );
  },
);

SelectionBox.displayName = "SelectionBox";

export default SelectionBox;
