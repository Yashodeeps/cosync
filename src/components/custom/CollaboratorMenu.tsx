"use client";
import { Dot, Loader, Loader2, Ship } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { set } from "react-hook-form";

const CollaboratorMenu = ({ collaborators }: { collaborators: any[] }) => {
  const [querySearch, setQuerySearch] = useState("");
  const debounced = useDebounceCallback(setQuerySearch, 300);
  const { toast } = useToast();
  const [matchedUsers, setMatchedUsers] = useState([] as any[]);
  const [loading, setLoading] = useState(false);

  const handleDialogOpen = () => {
    setQuerySearch(""); // Reset querySearch when dialog opens
  };
  useEffect(() => {
    const sendInvite = async () => {
      if (querySearch === "") {
        setMatchedUsers([]); // Clear matched users when query is empty
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `/api/collaboration/searchusers?search=${querySearch}`
        );
        if (!response.data.success) {
          toast({
            title: "Error fetching users",
            description: response.data.message,
            variant: "destructive",
          });
        }
        setMatchedUsers(response.data.users);
        console.log(matchedUsers);
      } catch (error) {
        toast({
          title: "Error fetching users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    if (querySearch !== "") {
      sendInvite();
    } else {
      setMatchedUsers([]);
    }
  }, [querySearch]);

  return (
    <div className="p-4 m-4 border border-gray-700 shadow-lg rounded-lg h-full text-gray-200 ">
      <h1 className="text-xl font-semibold text-gray-500">Crew</h1>
      <ul className="mt-4 ">
        {collaborators.map((collaborator) => (
          <li key={collaborator.id} className="flex text-zinc-300 items-center">
            <Dot className="text-green-500" size={40} />{" "}
            {collaborator.user?.name || collaborator.user.username}
          </li>
        ))}
      </ul>

      <Dialog onOpenChange={handleDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-transparent border gap-2 border-dashed border-zinc-500 hover:bg-black mt-4">
            Add Crew <Ship strokeWidth={1} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md border-gray-300 bg-zinc-800 text-gray-300">
          <DialogHeader>
            <DialogTitle>Add Crew Member</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label>
                name/ username <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="eg, nami"
                className="bg-zinc-800 focus:ring-none focus:outline-none"
                onChange={(e) => debounced(e.target.value)}
              />
              <div className=" bg-black rounded-xl">
                {loading && (
                  <Loader2 className="animate-spin w-full content-center" />
                )}

                {matchedUsers.length > 0 &&
                  matchedUsers.map((user) => (
                    <div
                      key={user.id}
                      className=" items-center flex justify-between  px-4 py-1 "
                    >
                      <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-zinc-600">
                          @{user.username}
                        </div>
                      </div>
                      <Button
                        onClick={sendInvite}
                        className="bg-transparent border border-none gap-2 text-sm font-thin hover:bg-black hover:border hover:border-dashed border-zinc-500 "
                      >
                        Invite <Ship strokeWidth={1} />
                      </Button>
                    </div>
                  ))}
              </div>
              {querySearch === "" && (
                <div className="text-sm text-gray-500">
                  Search for a user to add
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollaboratorMenu;
