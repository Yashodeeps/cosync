import React, { useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
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

/** 



*/
const CanvasTab = ({ value }: { value: string }) => {
  const [roomTitle, setRoomTitle] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);

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
    }
  };

  return (
    <div>
      <TabsContent value={value}>
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

        <div className="flex gap-4">
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => (
              <div key={room.id} className="flex">
                <RoomCard title={room.name} id={room.id} />
              </div>
            ))
          ) : (
            <h1>No rooms found create new Room</h1>
          )}
        </div>
      </TabsContent>
    </div>
  );
};

export default CanvasTab;
