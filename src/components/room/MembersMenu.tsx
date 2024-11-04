"use client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React, { useEffect, useState } from "react";
import VideoComBar from "./VideoComBar";
import { useSession } from "next-auth/react";
import { Crown, Users } from "lucide-react";

import Invite from "./Invite";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Hint } from "../custom/Hint";

interface MembersMenuProps {
  name: string;
  username: string;
  members: any;
  others: any;
  ownerId?: number;
  roomId?: string;
}

const MembersMenu = ({
  name,
  username,
  members = [],
  others = [],
  ownerId,
  roomId,
}: MembersMenuProps) => {
  const [showAllMembers, setShowAllMembers] = useState(false);

  const session = useSession();
  const isOwner = session.data?.user?.id === ownerId;

  const liveMembers = members.filter((member: any) =>
    others.some((other: any) => other.info.name === member.username)
  );
  const offlineMembers = members
    .filter(
      (member: any) =>
        !liveMembers.some((liveMember: any) => liveMember.id === member.id)
    )
    .filter((member: any) => member.username !== session.data?.user.username);

  return (
    <div
      className={`absolute  top-2 right-2 flex justify-center items-center  gap-y-4  z-40`}
    >
      <div className=" rounded-md p-2 flex gap-1 flex-col shadow-md">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              size={"icon"}
              className="  bg-gray-800 hover:bg-gray-700 text-zinc-100   "
            >
              {" "}
              <Hint tooltip="members" position="bottom" sideOffset={20}>
                <Users size={20} />
              </Hint>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" m-2 bg-gray-800">
            <div className="text-gray-300 text-sm flex items-center gap-3 px-4 font-bold">
              <div className="h-2 w-2 bg-green-500 rounded-full flex justify-center items-center" />
              <div>
                {" "}
                {session.data?.user.name}{" "}
                <span className="font-normal text-xs">(you)</span>
              </div>
              {Number(session.data?.user.id) === ownerId && <Crown size={16} />}
            </div>
            <div className={`px-4  `}>
              <div className="mt-2 text-sm">
                {liveMembers.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 text-gray-200 "
                  >
                    <div className="h-2 w-2 bg-green-500 rounded-full flex justify-center items-center" />
                    {member.name} {member.id === ownerId && <Crown size={16} />}
                  </div>
                ))}
              </div>

              <Separator className="my-2 bg-gray-500 " />

              {offlineMembers.map((member: any) => (
                <div
                  key={member.id}
                  className="text-gray-400 flex items-center gap-3 text-sm"
                >
                  <div className="h-2 w-2  bg-red-800 rounded-full flex justify-center items-center" />
                  {member.name} {member.id === ownerId && <Crown size={16} />}
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {roomId && <Invite roomId={roomId} ownerId={ownerId} />}
    </div>
  );
};

export default MembersMenu;
