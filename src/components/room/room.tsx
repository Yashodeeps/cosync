"use client";

import { ReactNode } from "react";
import {
  RoomProvider,
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";

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
        }}
      >
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
