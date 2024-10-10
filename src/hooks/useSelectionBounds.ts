import { Layer, XYWH } from "@/types/canvas";
import { shallow } from "@liveblocks/client";
import { useSelf, useStorage } from "@liveblocks/react";

const boundingBox = (layers: Layer[]): XYWH | null => {
  const first = layers[0];
  if (!first) return null;

  let left = first.x;
  let right = first.x + first.width;
  let top = first.y;
  let bottom = first.y + first.height;

  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];

    if (left > x) left = x;
    if (right < x + width) right = x + width;
    if (top > y) top = y;
    if (bottom < y + height) bottom = y + height;
  }
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

const useSelectionBounds = () => {
  //getting all selections of me
  const selection = useSelf((self) => self.presence.selection);

  return useStorage((root) => {
    const selectionLayers = selection
      ?.map((layerId) => root.layers.get(layerId)!)
      .filter(Boolean);

    return selectionLayers ? boundingBox(selectionLayers) : null;
  }, shallow);
};

export default useSelectionBounds;
