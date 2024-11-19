"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { KanbanIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "../custom/TaskCard";
import Draggable from "react-draggable";
import KanbanBoard from "./KanbanBoard";
import axios from "axios";
import { useParams } from "next/navigation";

export interface Task {
  id?: number;
  title: string;
  description?: string;
  notes?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "none";
  taskColumn: string;
}

const ExtraToolbar = () => {
  const [showKanban, setShowKanban] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor)
  );

  const columns = [
    { title: "Stack", color: "text-teal-500", bgColor: "bg-teal-500/5" },
    { title: "Working", color: "text-blue-500", bgColor: "bg-blue-500/5" },
    {
      title: "Finished",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/5",
    },
  ];

  return (
    <div className="w-full flex items-center">
      <Button
        onClick={() => setShowKanban(true)}
        className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700 text-white 
          font-medium rounded-lg transition-all duration-200 hover:shadow-lg 
          flex items-center gap-2"
      >
        <KanbanIcon className="h-5 w-5" />
        <span>Show Kanban</span>
      </Button>

      <KanbanBoard
        showKanban={showKanban}
        onClose={() => setShowKanban(false)}
        sensors={sensors}
        columns={columns}
      />
    </div>
  );
};

export default ExtraToolbar;
