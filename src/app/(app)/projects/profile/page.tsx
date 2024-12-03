"use client";

import React, { useEffect, useState } from "react";
import { Camera, Trash2, Save, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Profile {
  name?: string | null;
  username?: string;
  email?: string | null;
  profile?: string | null;
}

const ProfileManager = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<Profile>();
  const [user, setUser] = useState<Profile | undefined>(undefined);
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      setTempProfile(session.user);
    }
  }, [session]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/update-profile", tempProfile);

      if (response.data.success) {
        await update({
          ...session,
          user: {
            ...session?.user,
            ...response.data.user,
          },
        });

        setUser(response.data.user);
        setTempProfile(response.data.user);

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
          variant: "default",
        });

        setIsEditing(false);
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempProfile(user);
    setIsEditing(false);
  };

  interface FileInputEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget & { files: FileList };
  }

  const handleImageUpload = (e: FileInputEvent) => {
    alert("Image upload is not implemented yet");
    return;
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete("/api/update-profile");
      if (response.data.success) {
        router.push("/");
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete your account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 shadow-lg mt-24">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-2xl text-gray-900 dark:text-white">
          Profile Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="cursor-pointer h-32 w-32 border border-gray-500">
              <AvatarImage src="" alt="" />
              <AvatarFallback className="bg-blue-800 hover:bg-blue-700 font-bold text-white text-6xl items-center">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Label
                htmlFor="picture-upload"
                className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg cursor-pointer 
                         hover:bg-gray-100 dark:hover:bg-slate-700 
                         text-gray-700 dark:text-gray-200
                         transition-colors duration-200"
              >
                <Camera className="w-5 h-5" />
                <Input
                  id="picture-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={isEditing ? (tempProfile?.name ?? "") : (user?.name ?? "")}
              onChange={(e) => {
                setTempProfile((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
              disabled={!isEditing}
              className="max-w-md bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700
                       text-gray-900 dark:text-gray-100
                       focus:ring-blue-500 dark:focus:ring-blue-400
                       disabled:bg-gray-100 dark:disabled:bg-slate-700
                       disabled:text-gray-500 dark:disabled:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-gray-700 dark:text-gray-200"
            >
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={
                isEditing ? tempProfile?.username || "" : user?.username || ""
              }
              onChange={(e) => {
                setTempProfile((prev) => ({
                  ...prev,
                  username: e.target.value,
                }));
              }}
              disabled={!isEditing}
              className="max-w-md bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700
                       text-gray-900 dark:text-gray-100
                       focus:ring-blue-500 dark:focus:ring-blue-400
                       disabled:bg-gray-100 dark:disabled:bg-slate-700
                       disabled:text-gray-500 dark:disabled:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={isEditing ? tempProfile?.email || "" : user?.email || ""}
              onChange={(e) => {
                setTempProfile((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
              disabled={!isEditing}
              className="max-w-md bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700
                       text-gray-900 dark:text-gray-100
                       focus:ring-blue-500 dark:focus:ring-blue-400
                       disabled:bg-gray-100 dark:disabled:bg-slate-700
                       disabled:text-gray-500 dark:disabled:text-gray-400"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="space-x-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700
                       text-white transition-colors duration-200"
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700
                         text-white transition-colors duration-200"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="border-gray-300 dark:border-gray-600
                         text-gray-700 dark:text-gray-200
                         hover:bg-gray-100 dark:hover:bg-gray-700
                         transition-colors duration-200"
              >
                Cancel
              </Button>
            </>
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700
                       text-white transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900 dark:text-white">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                This action cannot be undone. This will permanently delete your
                account and remove all of your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="border-gray-200 dark:border-gray-700
                          text-gray-700 dark:text-gray-200
                          hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700
                         text-white transition-colors duration-200"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ProfileManager;
