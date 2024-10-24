"use client";
import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";
import { useParams } from "next/navigation";
import { DoorClosed, DoorOpen } from "lucide-react";
import { Button } from "../ui/button";
import { nanoid } from "nanoid";

const VideoComBar = ({ name }: any) => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remotePeerId, setRemotePeerId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { roomId } = useParams();
  const [livePeers, setLivePeers] = useState<string[]>([]);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    // Get own peer ID
    peer.on("open", (id) => {
      setPeerId(id);
      setLivePeers((prev) => [...prev, id]);
    });

    // Listen for incoming calls
    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setMyStream(stream);
          call.answer(stream); // Answer with local stream

          // Update when the remote stream is received
          call.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play(); // Ensure the video starts playing
            }
          });
        });
    });

    return () => {
      peer.disconnect();
    };
  }, []);

  const initiateCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Automatically call the first peer in the room
        const otherPeerId = livePeers.find((id) => id !== peerId);
        if (otherPeerId) {
          const call = peerRef.current?.call(otherPeerId, stream);
          call?.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play(); // Ensure the video starts playing
            }
          });
        }
      })
      .catch((err) => console.error("Failed to get local stream", err));
  };

  const endCall = () => {
    myStream?.getTracks().forEach((track) => {
      track.stop();
    });
    remoteStream?.getTracks().forEach((track) => {
      track.stop();
    });
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    return () => {
      peerRef.current?.disconnect();
    };
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-gray-800 rounded-md p-2 flex gap-1 flex-col shadow-md">
        <div className="flex gap-4 items-center">
          <Button
            className="flex gap-2 bg-transparent hover:bg-gray-700 text-gray-200"
            onClick={initiateCall}
          >
            <DoorOpen /> Join
          </Button>
          <Button
            className="flex gap-2 bg-transparent hover:bg-gray-700 text-gray-200"
            onClick={endCall}
          >
            <DoorClosed />
          </Button>
        </div>
        <div
          className={` flex ${
            !videoRef.current?.srcObject ? "hidden" : "block"
          }`}
        >
          <video
            ref={videoRef}
            muted
            autoPlay
            style={{ width: "200px", height: "150px" }}
          />
        </div>
        <div
          className={` flex ${
            !remoteVideoRef.current?.srcObject ? "hidden" : "block"
          }`}
        >
          <video
            ref={remoteVideoRef}
            autoPlay
            style={{ width: "200px", height: "150px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoComBar;
