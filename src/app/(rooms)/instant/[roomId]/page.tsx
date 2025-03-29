import Canvas from "@/components/room/Canvas";
import { Room } from "@/components/room/room";

const page = ({ params }: { params: { roomId: string } }) => {
  return (
    <div>
      <Room roomId={params.roomId}>
        <Canvas duration={10} roomId={params.roomId} />
      </Room>
    </div>
  );
};

export default page;
