"use client";

import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import RoomHeader from "./RoomHeader";
import ToolBar from "./ToolBar";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useOthers,
  useMutation,
} from "@liveblocks/react/suspense";
import { useOthersMapped, useSelf, useStorage } from "@liveblocks/react";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  Layer,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";
import Invite from "./Invite";
import CursorsPresense from "./CursorsPresense";
import { set } from "zod";
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/utils";
import { root } from "postcss";
import { LiveObject } from "@liveblocks/client";
import LayerPreview from "./LayerPreview";
import SelectionBox from "./SelectionBox";
import SelectionTools from "./SelectionTools";
import VideoComBar from "./VideoComBar";
import { useSession } from "next-auth/react";
// import { useSocket } from "@/lib/SocketProvider";
import { useParams } from "next/navigation";
import MembersMenu from "./MembersMenu";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import Path from "./objects/Path";
import { useDisableScrollBounce } from "@/hooks/useDisableScrollBounce";
import useDeleteLayers from "@/hooks/useDeleteLayers";

const MAX_LAYERS = 111;
interface CanvasProps {
  roomId: string;
}

export interface SocketProps {
  room: string;
  username: string;
}

const Canvas = ({ roomId }: CanvasProps) => {
  const session = useSession();
  const params = useParams();
  const others = useOthers();
  const { toast } = useToast();
  const [roomInfo, setRoomInfo] = useState<any | null>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);
  const layerIds = useStorage((root) => root.layerIds);

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 255,
    g: 255,
    b: 255,
  });

  useDisableScrollBounce();
  const deleteLayers = useDeleteLayers();
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useEffect(() => {
    const fetchRoomInfo = async () => {
      const response = await axios.get(`/api/room-by-id?roomId=${roomId}`);

      if (!response) {
        toast({
          title: "Error",
          description: "Failed to fetch room info",
          variant: "destructive",
        });
      }

      setRoomInfo(response.data.room);
    };
    fetchRoomInfo();
  }, []);

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note,

      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }
      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType as number,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        color: lastUsedColor,
      });
      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );

  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return;

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );

  const unSelectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();
      setCanvasState({ mode: CanvasMode.SelectionNet, current, origin });
      if (layerIds) {
        const ids = findIntersectingLayersWithRectangle(
          layerIds.slice(),
          layers,
          origin,
          current
        );
        setMyPresence({ selection: ids });
      }
    },
    [layerIds]
  );

  const startMuliSelection = useCallback((current: Point, origin: Point) => {
    if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
      setCanvasState({ mode: CanvasMode.SelectionNet, current, origin });
    }
  }, []);

  const insertPath = useMutation(
    ({ self, setMyPresence, storage }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;
      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();
      liveLayers.set(
        id,
        new LiveObject(penPointToPathLayer(pencilDraft, lastUsedColor))
      );
      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);

      setMyPresence({ pencilDraft: null });
      setCanvasState({ mode: CanvasMode.Pensil });
    },
    [lastUsedColor]
  );

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setCanvasState({ mode: CanvasMode.Pensil });
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor, setCanvasState]
  );

  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;
      console.log({
        mode: canvasState.mode,
        buttons: e.buttons,
        hasPencilDraft: !!pencilDraft,
        pencilDraftLength: pencilDraft?.length,
      });
      if (
        canvasState.mode !== CanvasMode.Pensil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode]
  );

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) return;
      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);

      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState]
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        corner,
        initialBounds,
      });
    },
    [history]
  );

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

      if (canvasState.mode === CanvasMode.Pressing) {
        startMuliSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pensil) {
        continueDrawing(current, e);
      }

      setMyPresence({ cursor: current });
    },
    [
      canvasState,
      resizeSelectedLayer,
      camera,
      translateSelectedLayers,
      continueDrawing,
      startMuliSelection,
      updateSelectionNet,
    ]
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Pensil) {
        startDrawing(point, e.pressure);
        return;
      }
      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    },
    [camera, canvasState.mode, setCanvasState]
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unSelectLayers();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Pensil) {
        console.log("inserting path");
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        if (
          canvasState.layerType === LayerType.Text ||
          canvasState.layerType === LayerType.Note ||
          canvasState.layerType === LayerType.Rectangle ||
          canvasState.layerType === LayerType.Ellipse
        ) {
          insertLayer(canvasState.layerType, point);
        }
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }

      history.resume();
    },
    [
      setCanvasState,
      camera,
      canvasState,
      history,
      insertLayer,
      unSelectLayers,
      insertPath,
    ]
  );

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        //no point selecting layer while inserting or drawing
        canvasState.mode === CanvasMode.Pensil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },

    [setCanvasState, camera, canvasState.mode, history]
  );

  const selections = useOthersMapped((other) => other.presence.selection);
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    //iterate over selections of each user
    for (const user of selections) {
      const [connectionId, selection] = user;

      //iterate over the layers selected by the user
      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        //this case breaks the text box backspace
        // case "Backspace":
        //   deleteLayers();
        //   break;

        case "z":
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        case "y":
          if (e.ctrlKey || e.metaKey) {
            history.redo();
          }
          break;

        case "Delete":
          deleteLayers();
          break;
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteLayers, history]);

  return (
    <div className="h-screen w-full touch-none flex justify-center items-center relative">
      <RoomHeader roomId={roomId} roomInfo={roomInfo} />
      <Invite roomId={roomId} ownerId={roomInfo?.ownerId} />
      <ToolBar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={history.undo}
        redo={history.redo}
      />

      <MembersMenu
        name={session.data?.user.name ?? "Member"}
        username={session.data?.user.username ?? "cosynclabs"}
        members={roomInfo?.members}
        ownerId={roomInfo?.ownerId}
        others={others}
      />
      <VideoComBar
        name={session.data?.user.name ?? "Member"}
        username={session.data?.user.username ?? "cosynclabs"}
      />

      {/*  added an extra div to balance styles */}
      <div className="absolute inset-0 overflow-hidden">
        {" "}
        <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />
        <svg
          className="h-[100vh] w-[100vw]"
          onWheel={onWheel}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerUp={onPointerUp}
          onPointerDown={onPointerDown}
        >
          <g
            style={{
              transform: `translate(${camera.x}px, ${camera.y}px)`,
            }}
          >
            {layerIds &&
              layerIds.map((layerId) => (
                <LayerPreview
                  key={layerId}
                  id={layerId}
                  onLayerPointerDown={onLayerPointerDown}
                  selectionColor={layerIdsToColorSelection[layerId]}
                  camera={camera}
                />
              ))}
            <SelectionBox
              onResizeHandlePointerDown={onResizeHandlePointerDown}
            />
            {canvasState.mode === CanvasMode.SelectionNet &&
              canvasState.current != null && (
                <rect
                  className="fill-blue-500/5 stroke-blue-500 stroke-1"
                  x={Math.min(canvasState.origin.x, canvasState.current.x)}
                  y={Math.min(canvasState.origin.y, canvasState.current.y)}
                  width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                  height={Math.abs(
                    canvasState.origin.y - canvasState.current.y
                  )}
                />
              )}

            <CursorsPresense />
            {pencilDraft != null && pencilDraft.length > 0 && (
              <Path
                points={pencilDraft}
                fill={colorToCss(lastUsedColor)}
                x={0}
                y={0}
              />
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Canvas;
