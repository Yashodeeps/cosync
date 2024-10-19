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

const RoomCard = ({ title, id }: { title: string; id: number }) => {
  const router = useRouter();
  return (
    <Card
      className="bg-transparent  text-gray-200 p-2 m-2 relative my-4 "
      key={id}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>{project.description}</CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Progress</p>
            <p className="text-sm text-muted-foreground">
              Construction in process...
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-amber-800 hover:bg-amber-700"
          onClick={() => {
            router.push(`/room/${id}`);
          }}
        >
          Enter{" "}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
