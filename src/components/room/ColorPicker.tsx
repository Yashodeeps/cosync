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
      className="w-6 h-6 items-center flex justify-center hover:opacity-75 transition"
      onClick={() => onClick(color)}
    >
      <div
        className="h-6 w-6 rounded-md border border-gray-300 "
        style={{ background: colorToCss(color) }}
      />
    </button>
  );
};

const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-gray-200">
      <ColorButton color={{ r: 243, g: 82, b: 35 }} onClick={onChange} />
      <ColorButton color={{ r: 244, g: 144, b: 12 }} onClick={onChange} />
      <ColorButton color={{ r: 250, g: 250, b: 250 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 0, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 255, b: 255 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 0, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 255, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 0, b: 255 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 255, b: 255 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 0, b: 255 }} onClick={onChange} />
    </div>
  );
};

export default ColorPicker;
