"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import {
  Info,
  MessageSquare,
  MessageSquareCode,
  MessageSquareDashed,
} from "lucide-react";
import axios from "axios";
import { IconMoodEmpty } from "@tabler/icons-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { toast, useToast } from "../ui/use-toast";

const Navbar = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [requestFetchingError, setRequestFetchingError] = useState("");
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user as User);
    }
  }, [session]);

  useEffect(() => {
    const fetchCollabRequests = async () => {
      try {
        const response = await axios.get("/api/collaboration/get-request");
        setCollaborationRequests(response.data.collaborationRequests);
        console.log(response.data);
      } catch (error) {
        setRequestFetchingError(`Error fetching requests: ${error}`);
      }
    };
    fetchCollabRequests();

    const intervalId = setInterval(fetchCollabRequests, 30000); // Fetch every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [toast]);

  const handleSignOut = async () => {
    const data = await signOut({
      redirect: false,
      callbackUrl: "/",
    });
    if (!data) {
      console.log("Sign out falied");
    }
    router.push("/");
  };

  const acceptCollabRequest = async (collaborationId: Number) => {
    try {
      const response = await axios.patch("/api/collaboration/accept-request", {
        collaborationId,
        action: "ACCEPTED",
      });
      if (response.data.success) {
        toast({
          title: "Request accepted",
          description: "You have accepted the collaboration request",
          variant: "default",
        });
      } else {
        toast({
          title: "Error accepting request",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error accepting request",
        variant: "destructive",
      });
    }
  };

  const declineCollabRequest = async (collaborationId: Number) => {
    try {
      const response = await axios.patch("/api/collaboration/accept-request", {
        collaborationId,
        action: "DECLINED",
      });
      if (response.data.success) {
        toast({
          title: "Request Declined",
          description: "You have declined the collaboration request",
          variant: "default",
        });
      } else {
        toast({
          title: "Error declining request",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error declining request",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="p-3 md:p-4 shadow-md border-b-2 border-gray-700">
      <div className=" mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl font-bold text-gray-500">CoSyncLabs</div>
        <div className="px-4">
          {/* <ThemeToggle /> */}
          {session ? (
            <div className="flex gap-8 justify-center items-center ">
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger className="border-none focus:outline-none focus:border-none">
                    <MessageSquareCode
                      className="text-zinc-200 cursor-pointer m-1 "
                      size={30}
                    />
                    {collaborationRequests.length > 0 && (
                      <span className="absolute top-0 right-0 rounded-full h-2 w-2 bg-red-500"></span>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-800  text-white w-96 mr-6  overflow-y-scroll">
                    {" "}
                    <ScrollArea className="h-96 ">
                      {requestFetchingError && (
                        <div className="p-4 text-red-500 font-semibold ">
                          {requestFetchingError}
                        </div>
                      )}
                      {collaborationRequests.length > 0 ? (
                        collaborationRequests.map((request: any) => {
                          return (
                            <DropdownMenuItem
                              key={request.id}
                              className="focus:bg-zinc-700"
                            >
                              <div className=" space-y-2 border-b border-zinc-600 m-2 p-2 ">
                                <div className="space-y-2">
                                  <h1 className="text-lg text-zinc-300">
                                    You have been requested to colloborate on
                                    project:{" "}
                                    <span className="font-semibold text-teal-600">
                                      {request.project.title}
                                    </span>{" "}
                                  </h1>
                                  <p className="text-xs flex gap-1 items-center">
                                    <Info size={12} />
                                    {request.status}
                                  </p>
                                </div>
                                <div className="flex gap-8">
                                  <Button
                                    onClick={() => {
                                      acceptCollabRequest(Number(request.id));
                                    }}
                                    className="bg-transparent border border-teal-500  hover:bg-teal-700"
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      declineCollabRequest(Number(request.id));
                                    }}
                                    className="bg-transparent border border-red-700  hover:bg-red-700"
                                  >
                                    Decline
                                  </Button>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          );
                        })
                      ) : (
                        <div className="p-4 text-lg flex gap-2">
                          <IconMoodEmpty /> No New Notifactions
                        </div>
                      )}{" "}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="" alt="" />
                    <AvatarFallback className="bg-blue-950 hover:bg-blue-900 font-bold text-white text-lg">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-zinc-800 text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Settings
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button>Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
