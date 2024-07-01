"use client";
import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { IconClipboardCopy, IconTableColumn } from "@tabler/icons-react";
import CollaboratorMenu from "@/components/custom/CollaboratorMenu";
import { useParams } from "next/navigation";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { set } from "zod";

const page = () => {
  const params = useParams();
  const { toast } = useToast();
  const [collaborators, setCollaborators] = useState([]);
  const [openBoardTasks, setOpenBoardTasks] = useState<task[]>([]);
  const [task, setTask] = useState<string>("");

  interface task {
    id: number;
    task: string;
    projectId: number;
    userId: number;
  }

  const handleAddTask = async () => {
    if (task.length === 0) {
      toast({
        title: "Task",
        description: "Task cannot be empty",
        variant: "default",
      });
      return;
    }
    const response = await axios.post(
      `/api/create-project/openboard?projectid=${params.projectid}`,
      {
        task,
      }
    );
    if (response.data.success) {
      toast({
        title: "Task",
        description: "Task added successfully",
        variant: "default",
      });
      setTask("");
    }
  };

  useEffect(() => {
    async function fetchCollaborators() {
      try {
        const response = await axios.get(
          `/api/collaboration/collaborators?projectid=${params.projectid}`
        );

        if (!response.data.success) {
          toast({
            title: "Collaborators",
            description: "No collaborators found",
            variant: "default",
          });
        } else {
          setCollaborators(response.data.collaborators);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch collaborators",
          variant: "destructive",
        });
      }
    }
    fetchCollaborators();
    async function fetchOpenBoardTasks() {
      try {
        const response = await axios.get(
          `/api/create-project/openboard?projectid=${params.projectid}`
        );
        setOpenBoardTasks(response.data.tasks);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch open board tasks",
          variant: "destructive",
        });
      }
    }
    fetchOpenBoardTasks();
  }, [params.projectid, toast, task]);

  const openBoard = (
    <div className="w-full p-4 bg-black rounded-2xl mt-4 h-1/2">
      <div className=" text-white flex flex-col gap-4 h-full  ">
        <div className=" flex h-fit justify-between ">
          <div className="w-40 border border-teal-500 rounded-lg">
            <input
              onChange={(e) => setTask(e.target.value)}
              value={task}
              placeholder="add bounties"
              type="text"
              className="bg-transparent text-sm border-none px-2 text-zinc-200 focus:outline-none w-28"
            />
            <Button
              onClick={handleAddTask}
              className="border text-zinc-200 border-transparent bg-transparent hover:text-teal-500 hover:bg-transparent"
            >
              +
            </Button>
          </div>

          <h1 className="text-lg text-zinc-700 font-bold">Open Board</h1>
        </div>

        <div className="flex gap-4">
          {openBoardTasks
            ? openBoardTasks.toReversed().map((task: any) => (
                <div
                  key={task.id}
                  className="border border-gray-700 p-2 rounded-lg mx-2"
                >
                  <p className="text-sm">{task.task}</p>
                </div>
              ))
            : "No tasks found"}
        </div>
      </div>
    </div>
  );

  const workBoard = (
    <div className="flex gap-3 h-1/2">
      <div className="w-1/3 p-4 bg-black rounded-2xl my-4 h-full">
        <div className=" text-white flex flex-col gap-4 h-full  ">
          <div className="">
            <h1 className="text-teal-700 text-lg font-semibold ">Stack</h1>
          </div>
        </div>
      </div>
      <div className="w-1/3 p-4 bg-black rounded-2xl my-4 h-full">
        <div className=" text-white flex flex-col gap-4 h-full  ">
          <div className="">
            <h1 className="text-blue-700 text-lg font-semibold ">Working</h1>
          </div>
        </div>
      </div>
      <div className="w-1/3 p-4 bg-black rounded-2xl my-4 h-full">
        <div className=" text-white flex flex-col gap-4 h-full  ">
          <div className="">
            <h1 className="text-green-700 text-lg font-semibold ">Finished</h1>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-full">
      <div className="w-full">
        {" "}
        {openBoard} {workBoard}
      </div>

      <div className="w-96">
        <CollaboratorMenu collaborators={collaborators} />
      </div>
    </div>
  );
};

export default page;
