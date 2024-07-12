import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ id, task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      key={id}
      className=" bg-zinc-900 w-80 h-40 rounded-lg mx-2 touch-none"
    >
      <p className="text-sm p-2 ">{task}</p>
      <p className="text-xs p-2">note note note note</p>
    </div>
  );
};

export default TaskCard;
