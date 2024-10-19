"use client";

import { DialogCloseButton } from "@/components/custom/CreateProjectDialog";
import SideMenu from "@/components/custom/SideMenu";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { title } from "process";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { addNewProject, addProjects } from "@/redux/slices/projectsSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CanvasTab from "@/components/custom/CanvasTab";

const Page = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fetchingRooms, setFetchingRooms] = useState<boolean | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const storeProjects: Project[] = useAppSelector(
    (state: RootState) => state.projects
  );
  console.log("storeProjects", storeProjects);

  console.log("session", session);
  interface Project {
    id: number;
    title: string;
    description: string;
    userId: number;
    openBoard: any[];
  }
  useEffect(() => {
    async function fetchProjects() {
      setFetchingRooms(true);
      try {
        const response = await axios.get("/api/create-project");
        if (!response.data.success) {
          toast({
            title: "Failed to fetch projects",
            description: response.data.message,
            variant: "destructive",
          });
        } else {
          setProjects(response.data.projects);
          dispatch(addProjects(response.data.projects));
        }
      } catch (error) {
        toast({
          title: "Failed to fetch projects",
          description: "Try again after sometime",
          variant: "destructive",
        });
      }
      finally {
        setFetchingRooms(false);
      }
    
    }

    fetchProjects();
  }, [toast, dispatch]);

  console.log("projects", projects);

  const hanldeProjectCreation = async () => {
    if (!title) {
      toast({
        title: "Title is required",
        description: "Please enter a title for the project",
        variant: "default",
      });
      return;
    }

    try {
      const response = await axios.post("/api/create-project", {
        title,
        description,
      });

      if (!response.data.success) {
        toast({
          title: "Failed to create project",
          description: response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Project created",
          description: "Project created successfully",
          variant: "default",
        });
        setProjects([...projects, response.data.project]);
        dispatch(addNewProject(response.data.project));
      }
    } catch (error) {
      toast({
        title: "Failed to create project",
        description: "Try again after sometime",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="my-5 w-full">
      {/* <Tabs defaultValue="canvas" className="w-full px-4">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger value="canvas">canvas</TabsTrigger>
          <TabsTrigger value="board">board</TabsTrigger>
        </TabsList> */}
        <CanvasTab value="canvas" />

    
      {/* </Tabs> */}
    </div>
  );
};

export default Page;
