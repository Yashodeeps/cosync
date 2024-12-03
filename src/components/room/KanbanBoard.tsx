"use client";

import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useDroppable,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "../custom/TaskCard";
import Draggable from "react-draggable";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "../ui/button";
import { Task } from "./ExtraToolbar";
import NewTaskCard from "../custom/NewTaskCard";
import axios from "axios";
import { useParams } from "next/navigation";
import { useToast } from "../ui/use-toast";

interface NewTaskForm {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "none";
  taskColumn: number | null;
}

const DroppableColumn = ({
  children,
  taskColumn,
  className,
}: {
  children: React.ReactNode;
  taskColumn: number;
  className: string;
}) => {
  const { setNodeRef } = useDroppable({
    id: `column-${taskColumn}`,
  });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
};

interface KanbanBoardProps {
  showKanban: boolean;
  onClose: () => void;
  sensors: any;
  columns: { title: string; color: string; bgColor: string }[];
}

const KanbanBoard = ({
  showKanban,
  onClose,
  sensors,
  columns,
}: KanbanBoardProps) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [newTaskForm, setNewTaskForm] = useState<NewTaskForm>({
    title: "",
    description: "",
    dueDate: "",
    priority: "none",
    taskColumn: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { roomId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/api/room/kanban?roomId=${roomId}`);
      setTasks(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setNewTaskForm({
      title: "",
      description: "",
      dueDate: "",
      priority: "none",
      taskColumn: null,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setNewTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTask = async (columnId: number) => {
    setIsLoading(true);
    if (newTaskForm.title.trim()) {
      const newTask: Task = {
        title: newTaskForm.title,
        description: newTaskForm.description,
        dueDate: newTaskForm.dueDate,
        priority: newTaskForm.priority || "none",
        taskColumn: columnId.toString(),
      };
      setTasks([...tasks, newTask]);
      try {
        console.log("newTask", newTask);
        const response = await axios.post(
          `/api/room/kanban?roomId=${roomId}`,
          newTask,
        );
        if (!response.data.success) {
          toast({
            title: "Failed to create task",
            description: response.data.message,
          });
        }
        console.log("response", response.data);
        await fetchTasks();
      } catch (error) {
        toast({
          title: "Failed to create task",
          variant: "destructive",
        });
      }
      setIsLoading(false);
      resetForm();
    }
  };

  const updateTask = async (task: Task) => {
    try {
      console.log("task-from update task", task);
      const response = await axios.put(
        `/api/room/kanban?roomId=${roomId}&taskId=${task.id}`,
        {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          taskColumn: task.taskColumn,
        },
      );

      if (!response.data.success) {
        toast({
          title: "Failed to update task",
          description: response.data.message,
        });
      }

      console.log("response", response.data);

      toast({
        title: "Task updated successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));

    try {
      const response = await axios.delete(
        `/api/room/kanban?roomId=${roomId}&taskId=${taskId}`,
      );

      if (!response.data.success) {
        toast({
          title: "Failed to delete task",
          description: response.data.message,
        });
      }

      toast({
        title: "Task deleted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id);
    setActiveTask(tasks.find((task) => task.id === active.id) || null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    const overId = String(over.id);
    if (overId.startsWith("column-")) {
      const newColumnId = parseInt(overId.split("-")[1]);
      if (Number(activeTask.taskColumn) !== newColumnId) {
        setTasks(
          tasks.map((task) => {
            if (task.id === active.id) {
              return { ...task, taskColumn: newColumnId.toString() };
            }
            return task;
          }),
        );
      }
    } else {
      const overTask = tasks.find((task) => task.id === over.id);
      if (!overTask) return;
      if (Number(activeTask.taskColumn) !== Number(overTask.taskColumn)) {
        setTasks(
          tasks.map((task) => {
            if (task.id === active.id) {
              return { ...task, taskColumn: overTask.taskColumn.toString() };
            }
            return task;
          }),
        );
      } else {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over.id);
        setTasks(arrayMove(tasks, oldIndex, newIndex));
      }
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    try {
      await updateTask(activeTask);
    } catch (error) {
      console.error("Failed to update task position:", error);
    }

    setActiveId(null);
    setActiveTask(null);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  if (!showKanban) return null;

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
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 min-h-[300px]">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex-1 min-w-[250px]">
                <div className="h-full rounded-md bg-gray-800/50 backdrop-blur-sm p-2 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h2
                      className={`${column.color} text-sm font-medium tracking-tight`}
                    >
                      {column.title}
                    </h2>
                    <span
                      className="px-2 py-0.5 text-xs font-medium rounded-full 
                          bg-gray-700 text-gray-200"
                    >
                      {
                        tasks.filter(
                          (task) => Number(task.taskColumn) === columnIndex,
                        ).length
                      }
                    </span>
                  </div>
                  <SortableContext
                    items={tasks
                      .filter((task) => Number(task.taskColumn) === columnIndex)
                      .map((task) => ({ id: task.id as UniqueIdentifier }))}
                    strategy={verticalListSortingStrategy}
                  >
                    <DroppableColumn
                      taskColumn={columnIndex}
                      className={`space-y-2 ${column.bgColor} p-2 rounded-md min-h-[200px]`}
                    >
                      {tasks
                        .filter(
                          (task) => Number(task.taskColumn) === columnIndex,
                        )
                        .map((task) => (
                          <TaskCard
                            key={task.id}
                            id={task.id ?? 0}
                            task={task.title}
                            notes={task.notes}
                            dueDate={task.dueDate}
                            priority={task.priority as any}
                            deleteTask={deleteTask}
                            // attachments={task.attachments}
                            // comments={task.comments}
                          />
                        ))}
                      {newTaskForm.taskColumn === columnIndex ? (
                        <NewTaskCard
                          newTaskForm={newTaskForm}
                          handleInputChange={handleInputChange}
                          handleAddTask={handleAddTask}
                          resetForm={resetForm}
                          columnIndex={columnIndex}
                          isLoading={isLoading}
                        />
                      ) : (
                        <Button
                          onClick={() =>
                            setNewTaskForm((prev) => ({
                              ...prev,
                              taskColumn: columnIndex,
                            }))
                          }
                          className="w-full group relative bg-gray-900/90 backdrop-blur-lg border border-gray-700/50 
                                  hover:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg p-2 text-sm
                                  text-gray-400 hover:text-white transition-all duration-200"
                        >
                          Add Task +
                        </Button>
                      )}
                    </DroppableColumn>
                  </SortableContext>
                </div>
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </Draggable>,
    document.body,
  );
};

export default KanbanBoard;
