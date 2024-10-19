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

const CanvasTab = () => {
  const [roomTitle, setRoomTitle] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  interface Room {
    id: number;
    name: string;
    ownerId: number;
    members: number[];
  }

  const createRoom = async () => {
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

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-teal-800 hover:bg-teal-700 text-white">
            New Room +
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md border-gray-300 bg-zinc-800 text-gray-300">
          <DialogHeader>
            <DialogTitle>Create New Room</DialogTitle>
            <DialogDescription>Rooms are private by default </DialogDescription>
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

      <div className="flex gap-4">
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
          rooms.map((room) => (
            <div key={room.id} className="flex">
              <RoomCard title={room.name} id={room.id} />
            </div>
          ))
        ) : (
          <h1>No rooms found create new Room</h1>
        )}
      </div>
    </div>
  );
};

export default CanvasTab;
