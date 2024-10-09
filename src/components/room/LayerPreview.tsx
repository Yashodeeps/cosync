import { Layer, LayerType, RectangleLayer } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";
import React, { memo } from "react";
import Rectangle from "./objects/Rectangle";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));
    if (!layer) {
      return null;
    }

    // const isRectangleLayer = (layer: Layer): layer is RectangleLayer =>
    //   layer.type === LayerType.Rectangle;

    // switch (layer.type) {
    //   case LayerType.Rectangle:
    //     return (
    //       <Rectangle
    //         id={id}
    //         layer={layer}
    //         onPointerDown={onLayerPointerDown}
    //         selectionColor={selectionColor}
    //       />
    //     );
    //   default:
    //     console.error("Unknown layer type", layer);
    //     return null;
    // }
    const isRectangleLayer = (layer: Layer): layer is RectangleLayer =>
      layer.type === LayerType.Rectangle;

    if (isRectangleLayer(layer)) {
      return (
        <Rectangle
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      );
    }

    console.error("Unknown layer type", layer);
    return null;
  }
);

LayerPreview.displayName = "LayerPreview";

export default LayerPreview;
