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
      console.log("fetching projects");
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
      <Tabs defaultValue="board" className="w-full px-4">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger value="board">board</TabsTrigger>
          <TabsTrigger value="canvas">canvas</TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-800 hover:bg-teal-700">
                Create new +
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-gray-300 bg-zinc-800 text-gray-300">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  project is private by default{" "}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label>
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="project title"
                    className="bg-zinc-800 focus:ring-none focus:outline-none"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter description here"
                    className="bg-zinc-800"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    className="bg-teal-800 hover:bg-teal-700 "
                    onClick={hanldeProjectCreation}
                  >
                    Create
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* projects */}
          <div className="text-gray-200 w-full">
            {" "}
            {storeProjects && (
              <div className=" m-4 flex flex-wrap">
                {storeProjects.map((project) => (
                  <Card
                    className="bg-transparent text-gray-200 p-2 m-2 relative "
                    key={project.id}
                  >
                    {project.userId === Number(session?.user.id) ? (
                      <span className="text-xs bg-teal-800 rounded-sm p-1 absolute top-1 right-1">
                        Owner
                      </span>
                    ) : (
                      <span className="text-xs bg-black rounded-sm p-1 absolute top-1 right-1 ">
                        Collaborator
                      </span>
                    )}
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      {/* <CardDescription>{project.description}</CardDescription> */}
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className=" flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Progress
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Construction in process...
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-amber-800 hover:bg-amber-700"
                        onClick={() => {
                          router.push(`/projects/${project.id}`);
                        }}
                      >
                        Enter{" "}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <CanvasTab value="canvas" />
      </Tabs>
    </div>
  );
};

export default Page;
