import { Layer, LayerType, RectangleLayer } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";
import React, { memo } from "react";
import Rectangle from "./objects/Rectangle";
import Ellipse from "./objects/Ellipse";
import Text from "./objects/Text";
import StickyNote from "./objects/StickyNote";
import { on } from "events";
import Path from "./objects/Path";
import { colorToCss } from "@/lib/utils";
import Arrow from "./objects/Arrow";
import Line from "./objects/Line";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
  camera: { x: number; y: number };
}

const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor, camera }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) {
      return null;
    }

    switch (layer.type) {
      case LayerType.Path:
        return (
          <Path
            key={id}
            points={layer.points}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
            x={layer.x}
            y={layer.y}
            fill={layer.color ? colorToCss(layer.color) : "#FFFFFF"}
            stroke={selectionColor}
          />
        );

      case LayerType.Arrow:
        return (
          <Arrow
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );

      case LayerType.Line:
        return (
          <Line
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );

      case LayerType.Note:
        return (
          <StickyNote
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
            position={{
              x: layer.x - camera.x,
              y: layer.y - camera.y,
            }}
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

    return null;
  }
);

LayerPreview.displayName = "LayerPreview";

export default LayerPreview;
