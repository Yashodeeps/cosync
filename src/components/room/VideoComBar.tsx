import React, { useCallback, useEffect, useRef, useState } from "react";
import UserAvatar from "../custom/UserAvatar";
import { Button } from "../ui/button";
import { DoorOpenIcon, SendHorizonal } from "lucide-react";
import { useSocket } from "@/lib/SocketProvider";
import { Separator } from "../ui/separator";
import ReactPlayer from "react-player";
import peer from "@/lib/peer";
import { useOthers } from "@liveblocks/react";

const VideoComBar = ({ name, username }: any) => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const members = useOthers();
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<string>("new");

  const handleUserJoined = useCallback(
    ({ username, socketId }: any) => {
      console.log("New user joined", username, socketId);
      setRemoteSocketId(socketId);
    },
    []
  );

  useEffect(() => {
    if (myStream) {
      console.log("Adding local stream tracks to peer connection");
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  const handleJoinCall = useCallback(async () => {
    console.log("Joining call");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
    const offer = await peer.getOffer();
    console.log("Created offer", offer);
    socket?.emit("join-call", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: any) => {
      console.log("Incoming call from", from);
      setRemoteSocketId(from);
      const answer = await peer.getAnswer(offer);
      console.log("Created answer", answer);
      socket?.emit("answer-call", { to: from, answer });
    },
    [socket]
  );

  const handleAnswerCall = useCallback(({ from, answer }: any) => {
    console.log("Call answered by", from);
    peer.setLocalDescription(answer);
    socket?.emit("call accepted", { to: from, answer });
  }, [socket]);

  const handleNegotiationNeeded = useCallback(async () => {
    console.log("Negotiation needed");
    if (peer.peer.signalingState !== "stable") {
      console.log("Skipping negotiation - signaling state not stable");
      return;
    }
    const offer = await peer.getOffer();
    console.log("Created negotiation offer", offer);
    if (!socket) return;
    socket.emit("peer-negotiation", { to: remoteSocketId, offer });
  }, [socket, remoteSocketId]);

  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }: any) => {
      console.log("Incoming negotiation from", from);
      const answer = await peer.getAnswer(offer);
      console.log("Created negotiation answer", answer);
      if (!socket) return;
      socket.emit("peer-negotiation-done", { to: from, answer });
    },
    [socket]
  );

  const handleNegotiationFinal = useCallback(async ({ answer }: any) => {
    console.log("Final negotiation", answer);
    console.log("Current signaling state:", peer.peer.signalingState);
    console.log("Current connection state:", peer.peer.connectionState);
    
    try {
      if (peer.peer.signalingState !== "have-local-offer") {
        console.log("Peer is not in 'have-local-offer' state, cannot set remote description");
        return;
      }
      await peer.peer.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("Remote description set successfully");
    } catch (error) {
      console.error("Error setting remote description:", error);
    }
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    peer.peer.addEventListener("connectionstatechange", () => {
      console.log("Connection state changed:", peer.peer.connectionState);
      setConnectionState(peer.peer.connectionState);
    });

    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
      peer.peer.removeEventListener("connectionstatechange", () => {});
    };
  }, [handleNegotiationNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (event) => {
      const remoteStreamTrack = event.streams;
      console.log("Got tracks!", remoteStreamTrack);
      setRemoteStream(remoteStreamTrack[0]);
    });

    return () => {
      peer.peer.removeEventListener("track", () => {
        console.log("Track event listener removed");
      });
    };
  }, []);

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
          <Button size={"icon"}>
            <SendHorizonal />
          </Button>
        </div>
        <Separator className=" bg-gray-500 mt-3" />
        <div>Connection State: {connectionState}</div>
        <div>
          {remoteSocketId &&
            (myStream ? (
              <div className="my-2 p-2 relative ">
                <ReactPlayer
                  playing
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
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoComBar;