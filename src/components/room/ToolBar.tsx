import React, { ReactNode } from "react";
import { Button } from "../ui/button";
import {
  Circle,
  MousePointer2,
  PencilLine,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

const ToolButton = ({
  children,
  isActive = true,
  onClick,
  isSelected,
}: {
  children: ReactNode;
  isActive?: Boolean;
  onClick?: () => void;
  isSelected?: boolean;
}) => {
  return (
    <Button
      className={`bg-transparent text-zinc-100 hover:bg-gray-700 ${
        isSelected && "bg-gray-700"
      }`}
      disabled={!isActive}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

interface ToolBarProps {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ToolBar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canRedo,
  canUndo,
}: ToolBarProps) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 z-40">
      <div className="bg-gray-800 rounded-md p-2 flex gap-1 flex-col items-center shadow-md">
        <ToolButton
          isSelected={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing
          }
          onClick={() => setCanvasState({ mode: CanvasMode.None })}
        >
          <MousePointer2 size={20} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            })
          }
          isSelected={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Text
          }
        >
          <Type size={20} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Note,
            })
          }
          isSelected={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Note
          }
        >
          <StickyNote size={20} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle,
            })
          }
          isSelected={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Rectangle
          }
        >
          <Square size={20} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Ellipse,
            })
          }
          isSelected={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Ellipse
          }
        >
          <Circle size={20} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Pensil,
            })
          }
          isSelected={canvasState.mode === CanvasMode.Pensil}
        >
          <PencilLine size={20} />
        </ToolButton>
      </div>{" "}
      <div className="bg-gray-800 rounded-md p-2 flex gap-1 flex-col items-center shadow-md">
        <ToolButton onClick={undo} isActive={canUndo}>
          <Undo2 />
        </ToolButton>
        <ToolButton onClick={redo} isActive={canRedo}>
          <Redo2 />
        </ToolButton>
      </div>{" "}
    </div>
  );
};

export default ToolBar;
