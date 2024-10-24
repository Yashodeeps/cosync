import { Layer, LayerType, RectangleLayer } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";
import React, { memo } from "react";
import Rectangle from "./objects/Rectangle";
import Ellipse from "./objects/Ellipse";
import Text from "./objects/Text";
import StickyNote from "./objects/StickyNote";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    const isRectangleLayer = (layer: Layer): layer is RectangleLayer =>
      layer.type === LayerType.Rectangle;

    if (!layer) {
      return null;
    }

    switch (layer.type) {
      case LayerType.Note:
        return (
          <StickyNote
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Text:
        return (
          <Text
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Ellipse:
        return (
          <Ellipse
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );

      case LayerType.Rectangle:
        return (
          <Rectangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      default:
        console.error("Unknown layer type", layer);
        return null;
    }
    // const isRectangleLayer = (layer: Layer): layer is RectangleLayer =>
    //   layer.type === LayerType.Rectangle;

    // if (isRectangleLayer(layer)) {
    //   return (
    //     <Rectangle
    //       id={id}
    //       layer={layer}
    //       onPointerDown={onLayerPointerDown}
    //       selectionColor={selectionColor}
    //     />
    //   );
    // }

    return null;
  }
);

LayerPreview.displayName = "LayerPreview";

export default LayerPreview;
