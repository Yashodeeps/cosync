import React, { useState } from "react";
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
import { CheckCheck, CopyIcon, PlusIcon, UserPlus } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import UserAvatar from "../custom/UserAvatar";
import { connectionIdToColor } from "@/lib/utils";
import { DoorOpenIcon } from "lucide-react";

const MAX_SHOWN_USERS = 2; //max users other than yourself

const Invite = ({ roomId }: { roomId: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const linkToCopy = `${process.env.NEXT_PUBLIC_BASE_URL}/room/join/${roomId}`;
  const { toast } = useToast();

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
  const currentUser = useSelf();

  const hasMoreUsers = users.length > MAX_SHOWN_USERS;

  return (
    <div className="absolute top-4 right-4 items-center z-50 flex  gap-4">
      <div className="bg-gray-800 rounded-md p-2 flex gap-1 flex-col items-center shadow-md">
        <div className="flex  gap-x-2">
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
        </div>
      </div>{" "}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size={"icon"}
            className=" gap-3 rounded-md px-2 py-2 bg-gray-800 hover:bg-gray-700 text-zinc-100  flex items-center shadow-md "
          >
            <UserPlus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={linkToCopy} readOnly />
            </div>
            <Button
              type="submit"
              size="sm"
              className="px-3"
              onClick={handleCopy}
            >
              <span className="sr-only">Copy</span>
              {isCopied ? (
                <CheckCheck className="h-4 w-4" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invite;
