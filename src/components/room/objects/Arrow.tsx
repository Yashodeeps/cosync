import { colorToCss } from "@/lib/utils";
import { ArrowLayer } from "@/types/canvas";
import React from "react";

interface ArrowProps {
  id: string;
  layer: ArrowLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const Arrow = ({ id, layer, onPointerDown, selectionColor }: ArrowProps) => {
  const startX = 0;
  const startY = layer.height / 2;
  const endX = layer.width;
  const endY = layer.height / 2;

  const arrowHeadLength = Math.min(layer.width * 0.2, layer.height * 0.2, 20); // Responsive but capped
  const arrowHeadAngle = Math.PI / 6; // 30 degrees
  const strokeWidth = 2;

  const arrowPoint1X = endX - arrowHeadLength * Math.cos(-arrowHeadAngle);
  const arrowPoint1Y = endY - arrowHeadLength * Math.sin(-arrowHeadAngle);
  const arrowPoint2X = endX - arrowHeadLength * Math.cos(arrowHeadAngle);
  const arrowPoint2Y = endY - arrowHeadLength * Math.sin(arrowHeadAngle);

  const pathData = `
    M ${startX} ${startY}
    L ${endX} ${endY}
    M ${endX} ${endY}
    L ${arrowPoint1X} ${arrowPoint1Y}
    M ${endX} ${endY}
    L ${arrowPoint2X} ${arrowPoint2Y}
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

export default Arrow;
