import Canvas from "@/components/room/Canvas";
import React from "react";
import { Room } from "@/components/room/room";

interface RoomProps {
  params: {
    roomId: string;
  };
}

const RoomPage = ({ params }: RoomProps) => {
  return (
    <div>
      <Room roomId={params.roomId}>
        <Canvas roomId={params.roomId} />
      </Room>
    </div>
  );
};

export default RoomPage;
