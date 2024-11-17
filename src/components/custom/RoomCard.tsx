"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import HomeCanvas from "./HomeCanvas";

interface RoomCardProps {
  title: string;
  id: number;
  ownerId: number;
}

const RoomCard = ({ title, id, ownerId }: RoomCardProps) => {
  const router = useRouter();
  const session = useSession();

  return (
    <Card
      className="group relative w-72 my-6 mr-3 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-teal-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
      key={id}
    >
      {ownerId && (
        <div className="absolute right-2 top-2 z-10">
          {ownerId.toString() === session.data?.user.id ? (
            <div className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-full shadow-lg">
              Owner
            </div>
          ) : (
            <div className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 rounded-full shadow-lg">
              Member
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-100 tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>

      <div className="px-4 pb-4">
        <Button
          className="w-full bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 hover:from-purple-800 hover:to-purple-900 text-gray-100 font-medium py-2 rounded-md shadow-lg transform transition-all duration-300 hover:shadow-xl"
          onClick={() => {
            router.push(`/room/${id}`);
          }}
        >
          Enter Workspace
        </Button>
      </div>
    </Card>
  );
};

export default RoomCard;
