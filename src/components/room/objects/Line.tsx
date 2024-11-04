import { colorToCss } from "@/lib/utils";
import { LineLayer } from "@/types/canvas";
import React from "react";

interface LineProps {
  id: string;
  layer: LineLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const Line = ({ id, layer, onPointerDown, selectionColor }: LineProps) => {
  const startX = 0;
  const startY = layer.height / 2;
  const endX = layer.width;
  const endY = layer.height / 2;

  const strokeWidth = 2;

  const pathData = `
    M ${startX} ${startY}
    L ${endX} ${endY}
    M ${endX} ${endY}
    M ${endX} ${endY}
  `;

  return (
    <g
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(${layer.x}px, ${layer.y}px)`,
      }}
    >
      <path
        d={pathData}
        stroke={selectionColor || colorToCss(layer.color)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  );
};

export default Line;
