"use client";

import React from "react";
import { Hint } from "./Hint";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserAvatarProps {
  src?: string;
  name?: string;
  fallback?: string;
  borderColor?: string;
}

const UserAvatar = ({ src, name, fallback, borderColor }: UserAvatarProps) => {
  return (
    <div>
      <Hint position="bottom" tooltip={name || "Member"} sideOffset={18}>
        <Avatar
          className="w-8 h-8  border-2"
          style={{
            borderColor: borderColor,
          }}
        >
          <AvatarImage src={src} />
          <AvatarFallback className="text-xs font-semibold bg-blue-500 ">
            {fallback}
          </AvatarFallback>
        </Avatar>
      </Hint>
    </div>
  );
};

export default UserAvatar;
