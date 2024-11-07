import React, { useState } from "react";
import { TextLayer } from "@/types/canvas";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { cn, colorToCss } from "@/lib/utils";
import { useMutation } from "@liveblocks/react";

const Text = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}) => {
  const { x, y, width, height, color, value } = layer;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocusWrapper = (e: any) => {
    setIsFocused(true);
  };

  const handleBlurWrapper = (e: any) => {
    setIsFocused(false);
  };

  const calculateFontSize = (width: number, height: number) => {
    const maxFontSize = 72;
    const scaleFactor = 0.25;
    const minFontSize = 12;

    const fontSizeBasedOnHeight = height * scaleFactor;
    const fontSizeBasedOnWidth = width * scaleFactor;

    return Math.max(
      minFontSize,
      Math.min(fontSizeBasedOnWidth, fontSizeBasedOnHeight, maxFontSize)
    );
  };

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");
    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    const newValue = e.target.value;
    updateValue(newValue);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
      }}
    >
      <div className="w-full h-full">
        <ContentEditable
          html={isFocused || value ? value ?? "" : "text"}
          onChange={handleContentChange}
          onFocus={handleFocusWrapper}
          onBlur={handleBlurWrapper}
          className={cn(
            "h-full w-full flex items-center px-4 py-2 drop-shadow-md outline-none",
            !isFocused && !value && "text-gray-400"
          )}
          style={{
            fontSize: calculateFontSize(width, height),
            color: color ? colorToCss(color) : "#000",
            lineHeight: "1.2",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        />
      </div>
    </foreignObject>
  );
};

export default Text;

//text-area comp
// import React, { useState } from "react";
// import { TextLayer } from "@/types/canvas";
// import { cn, colorToCss } from "@/lib/utils";
// import { useMutation } from "@liveblocks/react";

// const TextArea = ({
//   id,
//   layer,
//   onPointerDown,
//   selectionColor,
// }: {
//   id: string;
//   layer: TextLayer;
//   onPointerDown: (e: React.PointerEvent, id: string) => void;
//   selectionColor?: string;
// }) => {
//   const { x, y, width, height, color, value } = layer;
//   const [isFocused, setIsFocused] = useState(false);

//   const handleFocusWrapper = () => {
//     setIsFocused(true);
//   };

//   const handleBlurWrapper = () => {
//     setIsFocused(false);
//   };

//   const calculateFontSize = (width: number, height: number) => {
//     const maxFontSize = 72;
//     const scaleFactor = 0.25;
//     const minFontSize = 12;

//     const fontSizeBasedOnHeight = height * scaleFactor;
//     const fontSizeBasedOnWidth = width * scaleFactor;

//     return Math.max(
//       minFontSize,
//       Math.min(fontSizeBasedOnWidth, fontSizeBasedOnHeight, maxFontSize)
//     );
//   };

//   const updateValue = useMutation(({ storage }, newValue: string) => {
//     const liveLayers = storage.get("layers");
//     liveLayers.get(id)?.set("value", newValue);
//   }, []);

//   const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const newValue = e.target.value;
//     updateValue(newValue);
//   };

//   return (
//     <foreignObject
//       x={x}
//       y={y}
//       width={width}
//       height={height}
//       onPointerDown={(e) => onPointerDown(e, id)}
//       style={{
//         outline: selectionColor ? `1px solid ${selectionColor}` : "none",
//       }}
//     >
//       <div className="w-full h-full">
//         <textarea
//           value={isFocused || value ? value ?? "" : "text"}
//           onChange={handleContentChange}
//           onFocus={handleFocusWrapper}
//           onBlur={handleBlurWrapper}
//           className={cn(
//             "h-full w-full flex items-center px-4 py-2 drop-shadow-md outline-none",
//             !isFocused && !value && "text-gray-400"
//           )}
//           style={{
//             fontSize: calculateFontSize(width, height),
//             color: color ? colorToCss(color) : "#000",
//             lineHeight: "1.5",
//             wordBreak: "break-word",
//             overflowWrap: "break-word",
//             resize: "none", // Prevent resizing
//           }}
//         />
//       </div>
//     </foreignObject>
//   );
// };

// export default TextArea;
