import React, { useState, useRef, useEffect } from "react";
import { Kalam } from "next/font/google";
import { TextLayer } from "@/types/canvas";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { cn, colorToCss } from "@/lib/utils";
import { useMutation } from "@liveblocks/react";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

const MIN_WIDTH = 200;
const MIN_HEIGHT = 40;
const PADDING = 16;

interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const Text = ({ id, layer, onPointerDown, selectionColor }: TextProps) => {
  const { x, y, width, height, color, value } = layer;
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || "");
  const textRef = useRef<HTMLDivElement>(null);

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");
    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const updateSize = useMutation(
    ({ storage }, newWidth: number, newHeight: number) => {
      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(id);
      if (layer) {
        layer.set("width", Math.max(newWidth, MIN_WIDTH));
        layer.set("height", Math.max(newHeight, MIN_HEIGHT));
      }
    },
    []
  );

  useEffect(() => {
    // Update size based on content
    if (textRef.current && isEditing) {
      const { width: contentWidth, height: contentHeight } =
        textRef.current.getBoundingClientRect();
      if (
        Math.abs(contentWidth - width) > 5 ||
        Math.abs(contentHeight - height) > 5
      ) {
        updateSize(contentWidth + PADDING * 2, contentHeight + PADDING * 2);
      }
    }
  }, [localValue, isEditing]);

  const handleContentChange = (e: ContentEditableEvent) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    updateValue(newValue);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (!localValue.trim()) {
      setLocalValue(""); // Clear empty text
      updateValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey)) {
      e.preventDefault();
      e.stopPropagation();
      textRef.current?.blur();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isEditing) {
      onPointerDown(e, id);
    } else {
      e.stopPropagation();
    }
  };

  const calculateFontSize = (width: number) => {
    // Dynamic font size based on width
    const baseFontSize = 16;
    const maxFontSize = 32;
    const scaleFactor = 0.25;
    const calculatedSize = Math.min(
      maxFontSize,
      baseFontSize + width * scaleFactor
    );
    return Math.max(baseFontSize, calculatedSize);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      style={{
        outline:
          selectionColor && !isEditing ? `1px solid ${selectionColor}` : "none",
      }}
    >
      <div
        className={cn(
          "h-full w-full relative",
          isEditing ? "ring-2 ring-blue-500" : ""
        )}
      >
        <ContentEditable
          innerRef={textRef}
          html={localValue}
          onChange={handleContentChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-w-[100px] min-h-[40px] w-full h-full outline-none px-4 py-2",
            "break-words whitespace-pre-wrap",
            font.className,
            isEditing ? "cursor-text" : "cursor-default"
          )}
          style={{
            fontSize: `${calculateFontSize(width)}px`,
            color: color ? colorToCss(color) : "#000",
            WebkitUserSelect: isEditing ? "text" : "none",
            userSelect: isEditing ? "text" : "none",
          }}
        />
        {!localValue && !isEditing && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400",
              font.className
            )}
            style={{
              fontSize: `${calculateFontSize(width)}px`,
            }}
          >
            Click to edit
          </div>
        )}
      </div>
    </foreignObject>
  );
};

export default Text;
