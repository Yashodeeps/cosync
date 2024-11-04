export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Camera = {
  x: number;
  y: number;
};

export enum LayerType {
  Image,
  Text,
  Note,
  Rectangle,
  Ellipse,
  Path,
}

export type RectangleLayer = {
  type: LayerType.Rectangle;
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
  value?: string;
};

export type EllipseLayer = {
  type: LayerType.Ellipse;
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
  value?: string;
};

export type PathLayer = {
  type: LayerType.Path;
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
  points: number[][];
  value?: string;
};

export type TextLayer = {
  type: LayerType.Text;
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
  value?: string;
};

export type NoteLayer = {
  type: LayerType.Note;
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
  value?: string;
};

export type Point = {
  x: number;
  y: number;
};

export type XYWH = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export type CanvasState =
  | {
      mode: CanvasMode.None;
    }
  | {
      mode: CanvasMode.Pensil;
    }
  | {
      mode: CanvasMode.SelectionNet;
      origin: Point;
      current?: Point;
    }
  | {
      mode: CanvasMode.Translating;
      current: Point;
    }
  | {
      mode: CanvasMode.Inserting;
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Path
        | LayerType.Text
        | LayerType.Note;
    }
  | {
      mode: CanvasMode.Resizing;
      initialBounds: XYWH;
      corner: Side;
    }
  | {
      mode: CanvasMode.Pressing;
      origin: Point;
    };

export enum CanvasMode {
  None,
  Pensil,
  SelectionNet,
  Translating,
  Inserting,
  Resizing,
  Pressing,
}

export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer
  | NoteLayer;
