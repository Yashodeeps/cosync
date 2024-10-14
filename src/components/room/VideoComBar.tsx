"use client";

import React, { useCallback, useEffect, useState } from "react";
import UserAvatar from "../custom/UserAvatar";
import { Button } from "../ui/button";
import { DoorOpenIcon, SendHorizonal } from "lucide-react";
import { useSocket } from "@/lib/SocketProvider";
import { Separator } from "../ui/separator";
import ReactPlayer from "react-player";
import peer from "@/lib/peer";
import { useOthers } from "@liveblocks/react";

const MAX_SHOWN_USERS = 2; //max users other than yourself

interface UserJoinedProps {
  username: string;
  socketId: string;
}

interface VideoComBarProps {
  username: string;
  name: string;
}

const VideoComBar = ({ name, username }: VideoComBarProps) => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const members = useOthers();

  const handleUserJoined = useCallback(
    ({ username, socketId }: UserJoinedProps) => {
      console.log("new user joined", username, socketId);
      setRemoteSocketId(socketId);
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  const handleJoinCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const offer = await peer.getOffer();
    socket?.emit("join-call", { to: remoteSocketId, offer });
    setMyStream(stream);
    sendStreams();
  }, [remoteSocketId, socket, sendStreams]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: any) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      const answer = await peer.getAnswer(offer);
      socket?.emit("answer-call", { to: from, answer });
    },
    [socket]
  );

  //acceptiong the call
  const handleAnswerCall = useCallback(
    ({ from, answer }: any) => {
      peer.setLocalDescription(answer);
      console.log("answered call", from, answer);
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    if (!socket) return;
    socket.emit("peer-negotiation", { to: remoteSocketId, offer });
  }, [socket, remoteSocketId]);

  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }: any) => {
      const answer = await peer.getAnswer(offer);
      if (!socket) return;
      socket.emit("peer-negotiation-done", { to: from, answer });
    },
    [socket]
  );

  const handleNegotiationFinal = useCallback(async ({ answer }: any) => {
    console.log("final negotiation", answer);
    await peer.setLocalDescription(answer);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (event) => {
      const remoteStream = event.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
      console.log("GOT tracks of remote stream : = ", remoteStream);
    });
  }, [sendStreams]);


  useEffect(() => {
    socket?.on("user-joined", handleUserJoined);
    socket?.on("incoming-call", handleIncomingCall);
    socket?.on("answer-call", handleAnswerCall);
    socket?.on("peer-negotiation", handleNegotiationIncoming);
    socket?.on("peer-negotiation-final", handleNegotiationFinal);

    return () => {
      socket?.off("user-joined", handleUserJoined);
      socket?.off("incoming-call", handleIncomingCall);
      socket?.off("answer-call", handleAnswerCall);
      socket?.off("peer-negotiation", handleNegotiationIncoming);
      socket?.off("peer-negotiation-final", handleNegotiationFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleAnswerCall,
    handleNegotiationIncoming,
    handleNegotiationFinal,
  ]);

  return (
    <div className="absolute top-[50%] -translate-y-[50%] right-2 flex flex-col gap-y-4 z-50">
      <div className="bg-gray-800 rounded-md p-2 flex gap-1 flex-col  shadow-md ">
        <div className="flex gap-4 items-center">
          <Button onClick={handleJoinCall} size={"icon"}>
            <DoorOpenIcon />
          </Button>
          <Button onClick={sendStreams} size={"icon"}>
            <SendHorizonal />
          </Button>
        </div>
        <Separator className=" bg-gray-500 mt-3" />
        <div>
          {remoteSocketId &&
            (myStream ? (
              <div className="my-2 p-2 relative ">
                <ReactPlayer
                  playing
                  muted
                  height={"150px"}
                  width={"200px"}
                  url={myStream}
                />
                <div className="absolute top-3 left-3 flex items-center gap-2  text-xs text-black font-semibold">
                  <UserAvatar fallback={name[0].toUpperCase()} /> {name}
                </div>
              </div>
            ) : (
              <div className="px-4 py-2 rounded-lg my-2 bg-gray-500 ">
                Empty here
              </div>
            ))}

          {remoteStream && (
            <div className="my-2 p-2 relative ">
              <ReactPlayer
                playing
                height={"150px"}
                width={"200px"}
                url={remoteStream}
              />
            </div>
          ) }
        </div>
      </div>{" "}
    </div>
  );
};

export default VideoComBar;
