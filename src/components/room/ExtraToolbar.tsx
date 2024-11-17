import React, { useState } from "react";
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
  useDroppable,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "../custom/TaskCard";
import Draggable from "react-draggable";

interface task {
  id: number;
  task: string;
}

const KanbanBoard = ({
  showKanban,
  onClose,
  tasks,
  sensors,
  columns,
  setTasks,
}: {
  showKanban: boolean;
  onClose: () => void;
  tasks: task[];
  sensors: any;
  columns: { title: string; color: string; bgColor: string }[];
  setTasks: any;
}) => {
  if (!showKanban) return null;
  const { setNodeRef } = useDroppable({
    id: "kanban",
  });

  function ondragover(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active?.id;
    const overId = over?.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = over.data.current?.type === "task";

    if (isActiveTask && isOverTask) {
      const activeIndex = tasks.findIndex((task) => task.id === activeId);
      const overIndex = tasks.findIndex((task) => task.id === overId);
      setTasks(arrayMove(tasks, activeIndex, overIndex));
    }
  }
  return ReactDOM.createPortal(
    <Draggable handle=".kanban-header">
      <div
        className="fixed top-28 left-52 z-50 bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-lg 
            border border-gray-700 shadow-lg w-[85%] max-w-[800px] cursor-move"
      >
        <div className="kanban-header flex justify-between items-center mb-3 cursor-grab active:cursor-grabbing">
          <h2 className="text-white text-lg font-bold">Kanban Board</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>
        <DndContext
          onDragOver={ondragover}
          sensors={sensors}
          collisionDetection={closestCorners}
        >
          <div className="flex gap-3 min-h-[300px]">
            {/* stack column/ todo column */}
            <div className="flex-1 min-w-[200px]">
              <div className="h-full rounded-md bg-gray-800/50 backdrop-blur-sm p-2 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h2
                    className={`text-gray-500 text-sm font-medium tracking-tight`}
                  >
                    Stack
                  </h2>
                  <span
                    className="px-2 py-0.5 text-xs font-medium rounded-full 
                          bg-gray-700 text-gray-200"
                  >
                    {tasks.length}
                  </span>
                </div>

                <SortableContext
                  items={tasks}
                  strategy={verticalListSortingStrategy}
                >
                  <div
                    className={`space-y-2 bg-gray-500/5 p-2 rounded-md min-h-[200px]`}
                  >
                    {tasks.map((task) => (
                      <TaskCard key={task.id} id={task.id} task={task.task} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </div>

            {/* working column/ in process column */}
            <div ref={setNodeRef} className="flex-1 min-w-[200px]">
              <div className="h-full rounded-md bg-gray-800/50 backdrop-blur-sm p-2 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h2
                    className={`text-gray-500 text-sm font-medium tracking-tight`}
                  >
                    Stack
                  </h2>
                  <span
                    className="px-2 py-0.5 text-xs font-medium rounded-full 
                          bg-gray-700 text-gray-200"
                  >
                    {tasks.length}
                  </span>
                </div>

                <SortableContext
                  items={tasks}
                  strategy={verticalListSortingStrategy}
                >
                  <div
                    className={`space-y-2 bg-gray-500/5 p-2 rounded-md min-h-[200px]`}
                  >
                    {/* {tasks.map((task) => (
                      <TaskCard key={task.id} id={task.id} task={task.task} />
                    ))} */}
                  </div>
                </SortableContext>
              </div>
            </div>

            {/* finished column */}

            <div className="flex-1 min-w-[200px]">
              <div className="h-full rounded-md bg-gray-800/50 backdrop-blur-sm p-2 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h2
                    className={`text-gray-500 text-sm font-medium tracking-tight`}
                  >
                    Stack
                  </h2>
                  <span
                    className="px-2 py-0.5 text-xs font-medium rounded-full 
                          bg-gray-700 text-gray-200"
                  >
                    {tasks.length}
                  </span>
                </div>

                <SortableContext
                  items={tasks}
                  strategy={verticalListSortingStrategy}
                >
                  <div
                    className={`space-y-2 bg-gray-500/5 p-2 rounded-md min-h-[200px]`}
                  >
                    {/* {tasks.map((task) => (
                      <TaskCard key={task.id} id={task.id} task={task.task} />
                    ))} */}
                  </div>
                </SortableContext>
              </div>
            </div>
          </div>
        </DndContext>
      </div>
    </Draggable>,
    document.body
  );
};

const ExtraToolbar = () => {
  const [tasks, setTasks] = useState<task[]>([
    { id: 1, task: "task 1" },
    { id: 2, task: "task 2" },
  ]);
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
    <div className="w-full flex items-center ">
      <Button
        onClick={() => setShowKanban(true)}
        className=" bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700 text-white 
          font-medium rounded-lg transition-all duration-200 hover:shadow-lg 
           flex items-center gap-2"
      >
        <KanbanIcon className="h-5 w-5" />
        <span>Show Kanban</span>
      </Button>

      <KanbanBoard
        showKanban={showKanban}
        onClose={() => setShowKanban(false)}
        tasks={tasks}
        sensors={sensors}
        columns={columns}
        setTasks
      />
    </div>
  );
};

export default ExtraToolbar;
