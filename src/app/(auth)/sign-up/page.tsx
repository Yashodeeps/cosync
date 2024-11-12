"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SignupSchema } from "@/Schema/SignupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();
  //zod implementation

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error signing up", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  flex-col relative ">
      <div className="shadow-xl p-6  rounded-xl bg-gradient-to-tl from-gray-800  to-gray-950 w-full md:w-1/3 z-30">
        <div className="flex flex-col items-center  justify-center">
          <h1 className="text-4xl font-bold text-gray-300 shadow-lg">
            ONBOARD COSYNC
          </h1>
          <Separator className="my-6" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              {" "}
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="text-red-500">*</span> name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="text-red-500">*</span> username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          debounced(e.target.value);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-red-500">*</span> email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-red-500">*</span> password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <Separator className="my-6" />
          <div className="text-center mt-4 font-semibold text-lg">
            <p>
              Already a member?{" "}
              <Link
                href="/sign-in"
                className="text-blue-500 hover:text-blue-600"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Page;
