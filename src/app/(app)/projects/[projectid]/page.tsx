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
    }
    setTask("");
    fetchOpenBoardTasks();
  };
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
  useEffect(() => {
    fetchCollaborators();
    fetchOpenBoardTasks();
  }, [params.projectid]);

  const Skeleton = () => (
    <div className=" text-white flex h-full  ">
      <div className="border flex h-fit border-teal-500 rounded-lg">
        <Input
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

      <div>
        {openBoardTasks
          ? openBoardTasks.map((task: any) => (
              <div
                key={task.id}
                className="border border-gray-700 p-2 rounded-lg m-2"
              >
                <p className="text-sm">{task.task}</p>
              </div>
            ))
          : "No tasks found"}
      </div>
    </div>
  );

  const items = [
    {
      title: "The Open Board",
      description: "Scratch all your ideas and thoughts here.",
      header: <Skeleton />,
      className: "md:col-span-4",
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    },

    {
      title: "Captain Deck",
      // header: <Skeleton />,
      className: "md:col-span-4",
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
  ];

  return (
    <div className="flex w-full">
      <BentoGrid className=" w-full pr-4 py-4 ">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
            icon={item.icon}
          />
        ))}
      </BentoGrid>{" "}
      <div className="w-96">
        {" "}
        <CollaboratorMenu collaborators={collaborators} />
      </div>
    </div>
  );
};

export default page;
