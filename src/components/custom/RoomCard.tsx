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
      className="bg-black hover:shadow-lg  text-gray-200 p-2 m-2 relative my-4  "
      key={id}
    >
      {ownerId &&
        (ownerId.toString() === session.data?.user.id ? (
          <div>
            <p className="text-xs  p-1 rounded-sm bg-teal-800 absolute right-1 top-1 ">
              Owner
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs  p-1 rounded-sm bg-gray-900 absolute right-1 top-1 ">
              Member
            </p>
          </div>
        ))}
      <CardHeader className="w-full">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 relative border-t ">
        <div className=" flex items-center space-x-4 rounded-md  px-4">
          {/* <p className="text-sm font-medium leading-none">Progress</p>
            <p className="text-sm text-muted-foreground">
              Construction in process...
            </p> */}
          <img className="w-44" src={"/cosynct.png"} />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-amber-800 hover:bg-amber-700"
          onClick={() => {
            router.push(`/room/${id}`);
          }}
        >
          Enter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
