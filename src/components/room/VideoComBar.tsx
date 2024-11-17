"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import axios from "axios";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useConnectionState,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, Room } from "livekit-client";
import { set } from "zod";
import { Video } from "lucide-react";
import ExtraToolbar from "./ExtraToolbar";

const VideoComBar = ({ name }: any) => {
  const { roomId } = useParams();
  const [token, setToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleRoomjoin = async () => {
    try {
      const resp = await axios.get(
        `/api/get-participant-token?room=${roomId}&username=${name}`
      );
      setToken(resp.data.token);
      setIsConnected(true);
    } catch (e) {
      console.error(e);
      setIsConnected(false);
    }
  };

  if (token === "") {
    return <div>Getting token...</div>;
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 mb-4 z-40 flex justify-center items-center">
      <div className=" rounded-lg p-4 shadow-lg  ">
        <div className="flex flex-col items-center gap-4">
          {!isConnected ? (
            <Button
              onClick={handleRoomjoin}
              className="bg-gray-800 flex gap-5 hover:bg-gray-900 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              <Video /> Join
            </Button>
          ) : (
            <div className="w-full">
              <LiveKitRoom
                video={false}
                audio={true}
                token={token || undefined}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                data-lk-theme="default"
                className="min-h-[150px] w-[200px]"
                onDisconnected={() => {
                  setIsConnected(false);
                }}
              >
                <MyVideoConference />
                <RoomAudioRenderer />
                <div className="">
                  <ControlBar variation="minimal" />
                </div>
              </LiveKitRoom>
            </div>
          )}
        </div>
      </div>
      <ExtraToolbar />
    </div>
  );
};

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout tracks={tracks} className="rounded-lg overflow-hidden">
      <ParticipantTile />
    </GridLayout>
  );
}

export default VideoComBar;
