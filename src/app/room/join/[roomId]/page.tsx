"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { set } from "zod";

interface RoomProps {
  params: {
    roomId: string;
  };
}

const JoinPage = ({ params }: RoomProps) => {
  const [roomInfo, setRoomInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const user = session?.user;
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const fetchRoomInfo = async () => {
    try {
      const response = await axios.get(
        `/api/room-by-id?roomId=${params.roomId}`
      );
      if (response.data.success === false) {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      } else {
        setRoomInfo(response.data.room);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch room data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchRoomInfo();
    }
  }, [status]);

  const acceptInvite = async () => {
    if (user?.id === roomInfo?.ownerId.toString()) {
      toast({
        title: "Error",
        description: "You are the owner of this room",
        variant: "destructive",
      });
    }

    try {
      setIsJoining(true);
      const response = await axios.post("/api/room/join", {
        roomId: params.roomId,
      });

      if (response.data.success === false) {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "You have joined the room",
          variant: "default",
        });
        setIsJoined(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (loading || !session) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-gray-900">
        <div className="bg-gray-800 flex flex-col justify-center items-center text-zinc-100 w-full max-w-lg p-8 rounded-lg shadow-xl">
          <div className="text-4xl w-8 h-3 font-semibold mb-4 text-center bg-gray-700 animate-pulse"></div>
          <p className="text-center w-10 h-2 text-lg mb-6 bg-gray-700 animate-pulse"></p>
          <div className="w-7 h-2 bg-gray-700 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gray-900">
      <div className="bg-gray-800 flex flex-col justify-center items-center text-zinc-100 w-full max-w-lg p-8 rounded-lg shadow-xl">
        <div className="text-4xl font-semibold mb-4 text-center">
          Join {roomInfo?.name}!
        </div>
        <p className="text-center text-lg mb-6">
          {isJoined
            ? "You have successfully Joined the room"
            : "You’ve been invited to join the room:"}
          <span className="font-bold"> {roomInfo?.name}</span>
        </p>
        {!isJoined ? (
          <Button
            size="lg"
            className="bg-teal-500 hover:bg-teal-600 flex gap-4"
            onClick={acceptInvite}
          >
            Accept Invite {isJoining && <Loader2 className="animate-spin" />}
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              className="bg-teal-500 hover:bg-teal-600"
              onClick={() => {
                router.push(`/room/${params.roomId}`);
              }}
            >
              Click to enter room
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default JoinPage;
