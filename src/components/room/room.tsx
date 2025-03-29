"use client";

import { ReactNode } from "react";
import {
  RoomProvider,
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { LiveMap, LiveObject, LiveList } from "@liveblocks/client";
import { Layer } from "@/types/canvas";
import LoadingSkeleton from "../custom/LoadingSkeleton";
import RoomTimer from "./RoomTimer";

export const Room = ({
  children,
  roomId,
  duration = 2 ,
}: {
  children: ReactNode;
  roomId: string;
  duration?: number;
}) => {
  const authEndpoint = roomId.startsWith("d-")
    ? `/api/instantmeet-auth`
    : `/api/liveblocks-auth`;

  return (
    <LiveblocksProvider throttle={16} authEndpoint={authEndpoint}>
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selection: [],
          pencilDraft: null,
          penColor: null,
        }}
        initialStorage={{
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList<string>([]),
          expirationTime: Date.now() + duration * 60 * 1000,
        }}
      >
        <ClientSideSuspense fallback={<LoadingSkeleton />}>
          {() => <RoomTimer>{children}</RoomTimer>}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
