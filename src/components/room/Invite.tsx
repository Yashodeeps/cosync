import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  CheckCheck,
  CopyIcon,
  Loader2,
  LogOut,
  Menu,
  PlusIcon,
  Ship,
  Trash,
  UserPlus,
} from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import UserAvatar from "../custom/UserAvatar";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useDebounceCallback } from "usehooks-ts";
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

const MAX_SHOWN_USERS = 2; //max users other than yourself

interface InviteProps {
  roomId: string;
  ownerId?: any;
}

const Invite = ({ roomId, ownerId }: InviteProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const linkToCopy = `${process.env.NEXT_PUBLIC_BASE_URL}/room/join/${roomId}`;
  const { toast } = useToast();
  const session = useSession();
  const [querySearch, setQuerySearch] = useState("");
  const debounced = useDebounceCallback(setQuerySearch, 300);
  const [loading, setLoading] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState([] as any[]);
  const [isInviteSent, setIsInviteSent] = useState<Boolean | null>(null);

  const isOwner = Number(session.data?.user?.id) === ownerId;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset the message after 2 seconds
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const users = useOthers();
  // const currentUser = useSelf();

  // const hasMoreUsers = users.length > MAX_SHOWN_USERS;

  const fetchUsers = useCallback(async () => {
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
    } catch (error) {
      toast({
        title: "Error fetching users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [querySearch, toast]);

  useEffect(() => {
    fetchUsers();
  }, [querySearch, fetchUsers]);

  const handleCloseDialog = () => {
    setMatchedUsers([]);
    setQuerySearch("");
  };

  const sendInvite = async (userId: Number) => {
    setIsInviteSent(false);
    try {
      const response = await axios.post(`/api/room/invite?roomId=${roomId}`, [
        userId,
      ]);

      if (!response.data.success) {
        toast({
          title: "Error sending invite",
          variant: "destructive",
        });
      }
      toast({
        title: "Invite sent, wait till user accepts",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error sending invite",
        variant: "destructive",
      });
    } finally {
      setIsInviteSent(true);
    }
  };

  return (
    <div className="absolute top-4 right-4 items-center z-50 flex  gap-4">
      {isOwner && (
        <Dialog
          onOpenChange={(open) => {
            if (!open) {
              setMatchedUsers([]);
              setQuerySearch("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              size={"icon"}
              className=" gap-3 rounded-md px-2 py-2 bg-gray-800 hover:bg-gray-700 text-zinc-100  flex items-center shadow-md "
            >
              <UserPlus />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-zinc-900">
            <DialogHeader>
              <DialogTitle>Invite Crew</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 ">
              <div className="flex flex-col items-center space-x-2 w-full">
                <div className="grid flex-1 gap-2 w-full">
                  <Label>
                    name/ username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="eg, nami"
                    className="bg-zinc-800 focus:ring-none focus:outline-none"
                    onChange={(e) => debounced(e.target.value)}
                  />
                  <div className=" bg-black rounded-xl w-full">
                    {matchedUsers.length > 0
                      ? matchedUsers.map((user) => (
                          <div
                            key={user.id}
                            className=" items-center flex justify-between  gap-4 my-3 px-4 py-1 "
                          >
                            <div className="flex gap-4">
                              {" "}
                              <UserAvatar
                                name={user.name}
                                fallback={user?.name?.[0] || "C"}
                              />
                              <div>
                                <div>{user.name}</div>
                                <div className="text-xs text-zinc-600">
                                  @{user.username}
                                </div>
                              </div>
                            </div>

                            <Button
                              onClick={() => sendInvite(user.id)}
                              variant={"ghost"}
                              className="flex gap-3"
                            >
                              {isInviteSent === false && (
                                <Loader2 className="animate-spin" />
                              )}

                              {isInviteSent ? (
                                <span>
                                  <Check className="text-green-500" />
                                </span>
                              ) : (
                                "Invite"
                              )}
                              <Ship strokeWidth={1} />
                            </Button>
                          </div>
                        ))
                      : loading && <UserListSkeleton count={2} />}
                  </div>
                  {querySearch === "" ? (
                    <div className="text-sm text-gray-500 flex justify-center ">
                      Search for a user to add
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No user found with that name
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-start flex items-center">
              <Button
                type="submit"
                size="sm"
                className="px-3 gap-2 flex my-2"
                variant={"secondary"}
                onClick={handleCopy}
              >
                Invite via Link
                {isCopied ? (
                  <CheckCheck className="h-4 w-4" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <div className="bg-gray-800 rounded-md  flex gap-1 flex-col items-center shadow-md">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              size={"icon"}
              className=" gap-3 rounded-md px-2 py-2 bg-gray-800 hover:bg-gray-700 text-zinc-100  flex items-center shadow-md "
            >
              <Menu />
            </Button>{" "}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 m-4">
            <DropdownMenuLabel>Danger</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {isOwner ? (
                <DropdownMenuItem>
                  Delete Room
                  <DropdownMenuShortcut>
                    <Trash className="text-red-500" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  Leave Room
                  <DropdownMenuShortcut>
                    <LogOut className="text-red-500" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>{" "}
    </div>
  );
};

export default Invite;

const UserListSkeleton = ({ count = 3 }) => {
  if (!count || count < 1) return null;

  const skeletons = Array(count).fill(null);

  return (
    <div className="w-full space-y-3">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="items-center flex justify-between gap-4 px-4 py-1 animate-pulse"
        >
          <div className="flex gap-4">
            {/* Avatar skeleton */}
            <div className="w-10 h-9 rounded-full bg-gray-300" />

            <div className="space-y-2">
              {/* Name skeleton */}
              <div className="h-4 w-24 bg-gray-300 rounded" />
              {/* Username skeleton */}
              <div className="h-3 w-16 bg-gray-300 rounded" />
            </div>
          </div>

          {/* Button skeleton */}
          <div className="h-8 w-20 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
};

//TODO: use this in video communication
{
  /* <div className="flex  gap-x-2">
          {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => {
            return (
              <UserAvatar
                borderColor={connectionIdToColor(connectionId)}
                key={connectionId}
                src={info?.picture}
                name={info.name}
                fallback={info?.name?.[0] || "C"}
              />
            );
          })}

          {currentUser && (
            <UserAvatar
              borderColor={connectionIdToColor(currentUser.connectionId)}
              src={currentUser.info?.picture}
              name={`${currentUser.info?.name} (You)`}
              fallback={currentUser.info?.name?.[0].toUpperCase() || "C"}
            />
          )}

          {hasMoreUsers && (
            <UserAvatar
              name={`${users.length - MAX_SHOWN_USERS} more`}
              fallback={`+${users.length - MAX_SHOWN_USERS}`}
            />
          )}
        </div> */
}
