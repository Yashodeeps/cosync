"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import React from "react";
import UserAvatar from "../custom/UserAvatar";
import { connectionIdToColor } from "@/lib/utils";
import { Button } from "../ui/button";
import { DoorOpenIcon } from "lucide-react";

const MAX_SHOWN_USERS = 2; //max users other than yourself

const VideoComBar = () => {
  const users = useOthers();
  const currentUser = useSelf();

  const hasMoreUsers = users.length > MAX_SHOWN_USERS;

  return (
    <div className="absolute top-[50%] -translate-y-[50%] right-2 flex flex-col gap-y-4 z-50">
      <div className="bg-gray-800 rounded-md p-2 flex gap-1 flex-col items-center shadow-md ">
        <Button size={"icon"}>
          <DoorOpenIcon />
        </Button>
      </div>{" "}
    </div>
  );
};

export default VideoComBar;
