"use client";

import React, { useCallback, useState } from "react";
import RoomHeader from "./RoomHeader";
import ToolBar from "./ToolBar";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useOthers,
  useMutation,
} from "@liveblocks/react/suspense";
import { useSelf } from "@liveblocks/react";
import { Camera, CanvasMode, CanvasState } from "@/types/canvas";
import Invite from "./Invite";
import CursorsPresense from "./CursorsPresense";
import { set } from "zod";
import { pointerEventToCanvasPoint } from "@/lib/utils";

interface CanvasProps {
  roomId: string;
}

const Canvas = ({ roomId }: CanvasProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const current = pointerEventToCanvasPoint(e, camera);
      setMyPresence({ cursor: current });
    },
    []
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const others = useOthers();
  const userCount = others.length;

  return (
    <div className="h-screen w-full touch-none flex justify-center items-center">
      <RoomHeader roomId={roomId} />
      <Invite roomId={roomId} />
      <ToolBar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />

      <div className="text-xl text-zinc-500 absolute top-1/2 right-1/2 ">
        There are {userCount} other user(s) online
      </div>

      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <g>
          <CursorsPresense />
        </g>
      </svg>
    </div>
  );
};

export default Canvas;
