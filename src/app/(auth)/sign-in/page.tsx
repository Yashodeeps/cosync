"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { SigninSchema } from "@/Schema/SigninSchema";
import { signIn } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof SigninSchema>) => {
    try {
      const result = await signIn("Credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast({
          title: "Login failed",
          description: "Incorrect username/email or password",
          variant: "destructive",
        });
      } else if (result?.url) {
        router.replace("/projects");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      toast({
        title: "Sign-in error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col relative">
      <div className="shadow-xl p-6 rounded-xl  space-y-4 bg-gradient-to-tl from-gray-800  to-gray-950  w-full md:w-1/3 z-30">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-300 shadow-lg">
            Welcome back!!
          </h1>
          <Separator className="my-6 bg-gray-800" />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email/ username"
                      {...field}
                      autoComplete="username"
                    />
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
                  <FormLabel>Password</FormLabel>

                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
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
              Sign in
            </Button>
          </form>
          <Separator className="my-6 bg-gray-800" />

          <div className="text-center mt-4">
            New to CoSync?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:text-blue-600">
              OnBoard here
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Page;
