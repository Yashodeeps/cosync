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
        <ClientSideSuspense fallback={
          <LoadingSkeleton/>
        }>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
