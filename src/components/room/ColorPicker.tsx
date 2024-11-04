"use client";

import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

interface ColorButtonProps {
  onClick: (color: Color) => void;
  color: Color;
}

const ColorButton = ({ onClick, color }: ColorButtonProps) => {
  return (
    <button
      className="w-5 h-5 items-center flex justify-center hover:opacity-75 transition"
      onClick={() => onClick(color)}
    >
      <div
        className="h-full w-full rounded-full border border-gray-300 "
        style={{ background: colorToCss(color) }}
      />
    </button>
  );
};

const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] mr-1">
      <ColorButton color={{ r: 255, g: 99, b: 242 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 149, g: 97, b: 255 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 0, g: 217, b: 255 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 68, g: 255, b: 161 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 255, g: 214, b: 10 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 255, g: 122, b: 69 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 87, g: 255, b: 219 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 255, g: 82, b: 82 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 45, g: 149, b: 255 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 199, g: 125, b: 255 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 255, g: 255, b: 255 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 229, g: 229, b: 229 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 156, g: 156, b: 156 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 64, g: 64, b: 64 }} onClick={onChange} />{" "}
      <ColorButton color={{ r: 0, g: 0, b: 0 }} onClick={onChange} />{" "}
    </div>
  );
};

export default ColorPicker;
