"use client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React, { useEffect, useState } from "react";
import VideoComBar from "./VideoComBar";
import { useSession } from "next-auth/react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Crown,
  User,
  Users,
} from "lucide-react";

interface MembersMenuProps {
  name: string;
  username: string;
  members: any;
  others: any;
  ownerId?: number;
}

const MembersMenu = ({
  name,
  username,
  members = [],
  others = [],
  ownerId,
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
      className={`absolute top-[45%] -translate-y-[50%] right-2 flex flex-col gap-y-4 z-40`}
    >
      <div className="bg-gray-800 rounded-md p-2 flex gap-1 flex-col shadow-md">
        {/* <HoverCard>
          <HoverCardTrigger> */}

        <div className="flex gap-3 items-center p-2">
          {" "}
          <Users size={24} /> Members
        </div>

        <div className="text-gray-300 flex items-center gap-3 px-4 font-bold">
          <div className="h-2 w-2 bg-green-500 rounded-full flex justify-center items-center" />
          <div>
            {" "}
            {session.data?.user.name}{" "}
            <span className="font-normal text-xs">(you)</span>
          </div>
          {Number(session.data?.user.id) === ownerId && <Crown size={16} />}
        </div>
        {/* </HoverCardTrigger>
          <HoverCardContent className=" m-4 bg-gray-800" side={"left"}> */}
        <div className={`px-4  `}>
          <div className="mt-2">
            {liveMembers.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center gap-3 text-gray-200"
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
              className="text-gray-400 flex items-center gap-3"
            >
              <div className="h-2 w-2  bg-red-800 rounded-full flex justify-center items-center" />
              {member.name} {member.id === ownerId && <Crown size={16} />}
            </div>
          ))}
        </div>
        {/* </HoverCardContent>
        </HoverCard> */}
      </div>
      <div className="bg-gray-800 rounded-md p-2 flex gap-1 flex-col items-center shadow-md">
        <VideoComBar
          name={session.data?.user.name ?? "Member"}
          username={session.data?.user.username ?? "cosynclabs"}
        />
      </div>{" "}
    </div>
  );
};

export default MembersMenu;
