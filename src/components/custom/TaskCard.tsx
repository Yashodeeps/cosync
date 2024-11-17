import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, GripVertical, MessageCircle, Paperclip } from "lucide-react";

interface TaskCardProps {
  id: number;
  task: string;
  notes?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  attachments?: number;
  comments?: number;
}

const TaskCard = ({
  id,
  task,
  notes = "No additional notes",
  dueDate = "2024-12-31",
  priority = "medium",
  attachments = 0,
  comments = 0,
}: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transition: transition || "transform 0.1s ease",
    transform: CSS.Transform.toString(transform),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "low":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative
        bg-gradient-to-br from-gray-900/95 via-gray-800/98 to-gray-900/95
        backdrop-blur-lg
        border border-gray-700/50
        rounded-lg
        shadow-sm hover:shadow-lg
        ${isDragging ? "scale-102 shadow-md opacity-95" : ""}
        touch-none
      `}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-1 top-1/2 -translate-y-1/2 p-1  rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div className="absolute -right-1 -top-1">
        <div className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`} />
      </div>

      <div className="p-3 ml-3 space-y-2">
        <p className="text-sm font-medium text-gray-200 line-clamp-2">{task}</p>

        <p className="text-xs text-gray-400 line-clamp-2">{notes}</p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-700/30">
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="w-3 h-3" />
            <span className="text-xs">
              {new Date(dueDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-400">
            {attachments > 0 && (
              <div className="flex items-center space-x-1">
                <Paperclip className="w-3 h-3" />
                <span className="text-xs">{attachments}</span>
              </div>
            )}
            {comments > 0 && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span className="text-xs">{comments}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-gray-200">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button className="p-1 rounded-md hover:bg-gray-700/50 text-gray-400 hover:text-red-400">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
