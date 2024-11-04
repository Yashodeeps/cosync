import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { toast } from "../ui/use-toast";
import RoomCard from "./RoomCard";
import { set } from "zod";
import { Skeleton } from "../ui/skeleton";
import { CircleOff, Loader2, RefreshCcw, RotateCw } from "lucide-react";

const CanvasTab = () => {
  const [roomTitle, setRoomTitle] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState<Boolean | null>(null);
  interface Room {
    id: number;
    name: string;
    ownerId: number;
    members: number[];
  }

  const createRoom = async () => {
    setCreatingRoom(true);
    try {
      const response = await axios.post("/api/room", {
        title: roomTitle,
      });
      if (!response) {
        toast({
          title: "Error creating room",
          description: "database connection issue! please try again",
          variant: "destructive",
        });
      }

      toast({
        title: "Room created",
        description: "Room has been created successfully",
      });
      fetchAllRooms();
    } catch (error) {
      toast({
        title: "Error creating room",
        description: "An error occurred while creating room",
        variant: "destructive",
      });
    } finally {
      setCreatingRoom(false);
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);
  const fetchAllRooms = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get("/api/room");
      if (!response) {
        toast({
          title: "Error fetching rooms",
          description: "database connection issue! please try again",
          variant: "destructive",
        });
      }

      setRooms(response.data.rooms);
    } catch (error) {
      toast({
        title: "Error fetching rooms",
        description: "An error occurred while fetching rooms",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  if (creatingRoom === true)
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

        <div className="relative flex flex-col text-lg font-semibold text-gray-300 gap-5 justify-center items-center w-full h-full">
          <Loader2 className="animate-spin w-8 h-8" />
          Constructing Canvas...
        </div>
      </div>
    );

  return (
    <div>
      <div className="flex gap-4 ">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal-800 hover:bg-teal-700 text-white">
              New Room +
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md border-gray-300 bg-zinc-800 text-gray-300">
            <DialogHeader>
              <DialogTitle>Create New Room</DialogTitle>
              <DialogDescription>
                Rooms are private by default{" "}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label>
                  Room Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="project title"
                  className="bg-zinc-800 focus:ring-none focus:outline-none"
                  onChange={(e) => setRoomTitle(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  onClick={createRoom}
                  className="bg-teal-800 hover:bg-teal-700 "
                >
                  Create
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button onClick={fetchAllRooms} variant={"ghost"} size={"icon"}>
          {" "}
          <RotateCw
            className={`${isFetching && "animate-spin text-green-500"}`}
          />
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        {isFetching === true ? (
          <div className="flex">
            <div className="flex flex-col space-y-3 m-4 p-4 border border-gray-600 rounded-md shadow-lg">
              <Skeleton className="h-[20px] w-[150px] rounded-xl bg-transparent border border-gray-600" />
              <div className="space-y-2">
                <Skeleton className="h-32 w-[250px] bg-transparent border border-gray-600" />
                <Skeleton className="h-6 w-[200px] bg-transparent border border-gray-600" />
              </div>
            </div>
            <div className="flex flex-col space-y-3 m-4 p-4 border border-gray-600 rounded-md shadow-lg">
              <Skeleton className="h-[20px] w-[150px] rounded-xl bg-transparent border border-gray-600" />
              <div className="space-y-2">
                <Skeleton className="h-32 w-[250px] bg-transparent border border-gray-600" />
                <Skeleton className="h-6 w-[200px] bg-transparent border border-gray-600" />
              </div>
            </div>
          </div>
        ) : rooms && rooms.length > 0 ? (
          rooms.toReversed().map((room: any) => (
            <div key={room.id} className="flex gap-4 flex-wrap">
              <RoomCard title={room.name} id={room.id} ownerId={room.ownerId} />
            </div>
          ))
        ) : (
          <div className="p-4 font-semibold text-lg text-gray-500 mx-[35%] mt-[10%] flex flex-col items-center justify-center ">
            <CircleOff size={64} />
            No rooms found create new Room/ Join
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasTab;
