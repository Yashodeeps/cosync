"use client";

import { ReactNode } from "react";
import {
  RoomProvider,
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { LiveMap, LiveObject, LiveList } from "@liveblocks/client";
import { Layer } from "@/types/canvas";

export const Room = ({
  children,
  roomId,
}: {
  children: ReactNode;
  roomId: string;
}) => {
  return (
    <LiveblocksProvider throttle={16} authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selection: [],
        }}
        initialStorage={{
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList<string>([]),
        }}
      >
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
