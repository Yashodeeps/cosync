import React, { useState } from "react";
import { Kalam } from "next/font/google";
import { NoteLayer } from "@/types/canvas";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { cn, colorToCss, getContrastingTextColor } from "@/lib/utils";
import { useMutation } from "@liveblocks/react";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.15;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(maxFontSize, fontSizeBasedOnHeight, fontSizeBasedOnWidth);
};

interface StickyNotesProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const StickyNote = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: StickyNotesProps) => {
  const { x, y, width, height, color, value } = layer;
  const [isEditing, setIsEditing] = useState(false);

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isEditing) {
      onPointerDown(e, id);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={handlePointerDown}
      style={{
        outline:
          !isEditing && selectionColor ? `1px solid ${selectionColor}` : "none",
        transition: "transform 0.1s ease-in-out",
        transform: `translate(0, ${isEditing ? "2px" : "0"})`,
      }}
      className={cn(
        "overflow-hidden rounded-lg",
        isEditing ? "shadow-sm" : "shadow-md"
      )}
    >
      <div
        className="w-full h-full relative group"
        style={{
          backgroundColor: color ? colorToCss(color) : "#fff",
          backgroundImage: `
          linear-gradient(${color ? colorToCss(color) : "#fff"} 0.1em, 
          rgba(0,0,0,0.05) 0.1em)
        `,
          backgroundSize: "100% 1.2em",
          boxShadow: isEditing
            ? "inset 0 1px 3px rgba(0,0,0,0.1)"
            : "inset 0 -2px 5px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <ContentEditable
          html={value || "cosync"}
          onChange={handleContentChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "h-full w-full flex items-center justify-center text-center outline-none px-4 py-2",
            font.className,
            "transition-all duration-200",
            isEditing ? "opacity-90" : "opacity-100"
          )}
          style={{
            fontSize: calculateFontSize(width, height),
            color: color ? getContrastingTextColor(color) : "#000",
            textShadow: isEditing ? "none" : "0 1px 1px rgba(0,0,0,0.05)",
          }}
        />
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            isEditing ? "hidden" : "block"
          )}
          style={{
            background: `
            linear-gradient(to bottom,
              rgba(255,255,255,0.2) 0%,
              rgba(255,255,255,0) 15%,
              rgba(0,0,0,0) 85%,
              rgba(0,0,0,0.05) 100%
            )
          `,
          }}
        />
      </div>
    </foreignObject>
  );
};

export default StickyNote;
