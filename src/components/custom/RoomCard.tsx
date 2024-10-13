import React from "react";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { Home, HomeIcon } from "lucide-react";

const RoomCard = ({ title, id }: { title: string; id: number }) => {
  const router = useRouter();
  const handleRoomClick = () => {
    router.push(`/room/${id}`);
  };
  return (
    <div
      onClick={handleRoomClick}
      className="border w-56 h-56 my-4 shadow-lg   cursor-pointer border-gray-600 rounded-lg p-4"
    >
      <div className="h-36">
        <Home />
      </div>
      <Separator className="border-gray-200" />
      <h1 className="p-4">{title}</h1>
    </div>
  );
};

export default RoomCard;
