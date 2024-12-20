import { colorToCss } from "@/lib/utils";
import { RectangleLayer } from "@/types/canvas";
import React from "react";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { x, y, width, height, color } = layer;

  const ROUNDED = 8;

  return (
    <rect
      className="drop-shadow-md "
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      width={width}
      height={height}
      strokeWidth={1}
      // fill={color ? colorToCss(color) : "transparent"}
      fill={"transparent"}
      stroke={color ? colorToCss(color) : "#CCC"}
      // stroke={colorToCss(color) || "#FFF"}
      rx={ROUNDED}
      ry={ROUNDED}
    />
  );
};

export default Rectangle;
