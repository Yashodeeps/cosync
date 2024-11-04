import React, { ReactNode } from "react";
import { Button } from "../ui/button";
import {
  Circle,
  Minus,
  MousePointer2,
  MoveRight,
  PencilLine,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";
import { Hint } from "../custom/Hint";

interface ToolButtonProps {
  children: ReactNode;
  isActive?: Boolean;
  onClick?: () => void;
  isSelected?: boolean;
  tooltip?: string;
  position?: "top" | "bottom" | "left" | "right";
  sideOffSet?: number;
}

const ToolButton = ({
  children,
  isActive = true,
  onClick,
  isSelected,
  tooltip,
  position,
  sideOffSet,
}: ToolButtonProps) => {
  return (
    <Button
      className={`bg-transparent text-zinc-100 hover:bg-gray-700 ${
        isSelected && "bg-gray-700"
      }`}
      disabled={!isActive}
      onClick={onClick}
      size={"icon"}
    >
      <Hint tooltip={tooltip || ""} position={position} sideOffset={sideOffSet}>
        {children}
      </Hint>
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
          tooltip="select"
          position="right"
          sideOffSet={24}
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
          tooltip="text"
          position="right"
          sideOffSet={24}
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
          tooltip="sticky note"
          position="right"
          sideOffSet={24}
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
          tooltip="rectangle"
          position="right"
          sideOffSet={24}
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
          tooltip="circle"
          position="right"
          sideOffSet={24}
        >
          <Circle size={20} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Arrow,
            })
          }
          isSelected={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Arrow
          }
          tooltip="arrow"
          position="right"
          sideOffSet={24}
        >
          <MoveRight size={20} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Line,
            })
          }
          isSelected={
            canvasState.mode === CanvasMode.Inserting &&
            canvasState.layerType === LayerType.Line
          }
          tooltip="line"
          position="right"
          sideOffSet={24}
        >
          <Minus size={20} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Pensil,
            })
          }
          isSelected={canvasState.mode === CanvasMode.Pensil}
          tooltip="pencil"
          position="right"
          sideOffSet={24}
        >
          <PencilLine size={20} />
        </ToolButton>
      </div>{" "}
      <div className="bg-gray-800 rounded-md p-2 flex gap-1 flex-col items-center shadow-md">
        <ToolButton
          onClick={undo}
          isActive={canUndo}
          tooltip="undo"
          position="right"
          sideOffSet={24}
        >
          <Undo2 />
        </ToolButton>
        <ToolButton
          onClick={redo}
          isActive={canRedo}
          tooltip="redo"
          position="right"
          sideOffSet={24}
        >
          <Redo2 />
        </ToolButton>
      </div>{" "}
    </div>
  );
};

export default ToolBar;
