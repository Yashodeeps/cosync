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
  Loader2,
  MessageSquare,
  MessageSquareCode,
  MessageSquareDashed,
} from "lucide-react";
import axios from "axios";
import { IconMoodEmpty } from "@tabler/icons-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { toast, useToast } from "../ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { set } from "zod";

interface RoomInvitation {
  id: number;
  roomId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  room: {
    name: string;
    description?: string;
  };
  sender: {
    name: string;
    username: string;
  };
}

const Navbar = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [requestFetchingError, setRequestFetchingError] = useState("");
  const [invitations, setInvitations] = useState([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (session && session.user) {
      setUser(session.user as User);
    }
  }, [session]);

  const {
    data: fetchedInvitations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["roomInvitations"],
    queryFn: async () => {
      const { data } = await axios.get("/api/room/invite");
      setInvitations(data.invitations);
      return data.invitations;
    },
    enabled: !!session?.user, // Only fetch if user is logged in
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const mutation = useMutation({
    mutationFn: async ({
      invitationId,
      status,
    }: {
      invitationId: number;
      status: "ACCEPTED" | "DECLINED";
    }) => {
      const response = await axios.patch("/api/room/invite", {
        invitationId,
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch invitations after mutation
      queryClient.invalidateQueries({ queryKey: ["roomInvitations"] });
      toast({
        title: "Success",
        description: "Invitation response updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleInvitationResponse = (
    invitationId: number,
    status: "ACCEPTED" | "DECLINED"
  ) => {
    mutation.mutate({ invitationId, status });
  };

  const handleSignOut = async () => {
    const data = await signOut({
      redirect: false,
      callbackUrl: "/",
    });
    if (!data) {
      console.error("Sign out falied");
    }
    router.push("/");
  };

  return (
    <nav className="p-3 md:p-4 shadow-md border-b-2 border-gray-700">
      <div className=" mx-auto flex flex-row justify-between items-center">
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
                    {invitations && invitations.length > 0 && (
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
                      {invitations && invitations.length > 0 ? (
                        invitations.map((invitation: any) => {
                          return (
                            <DropdownMenuItem
                              key={invitation.id}
                              className=" bg-gray-950 m-2 rounded-xl hover:bg-black "
                            >
                              <div
                                key={invitation.id}
                                className="w-full border-zinc-200 rounded-lg p-4"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-medium">
                                      Invitation: {invitation.room.name}
                                    </h3>
                                    <p className="text-sm text-zinc-500">
                                      From: {invitation.sender.name} (@
                                      {invitation.sender.username})
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleInvitationResponse(
                                          invitation.id,
                                          "DECLINED"
                                        )
                                      }
                                      disabled={mutation.isPending}
                                    >
                                      Decline
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleInvitationResponse(
                                          invitation.id,
                                          "ACCEPTED"
                                        )
                                      }
                                      disabled={mutation.isPending}
                                    >
                                      {mutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        "Accept"
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          );
                        })
                      ) : (
                        <div>
                          {isError && (
                            <div className="text-red-500 p-4">
                              {"Error loading invitations"}
                            </div>
                          )}
                          {isLoading ? (
                            <div className="flex justify-center items-center p-4">
                              <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                          ) : (
                            <div className="p-4 text-lg flex gap-2">
                              <IconMoodEmpty /> No New Notifactions
                            </div>
                          )}
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
