"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  useEffect(() => {
    const parentElement = document.querySelector(".flex");
    const childElement = document.querySelector(".text-6xl");

    if (parentElement && childElement) {
      console.log("Parent Element:", parentElement);
      console.log("Child Element:", childElement);
      console.log(
        "Parent Contains Child:",
        parentElement.contains(childElement)
      );
    } else {
      console.warn("Parent or Child element does not exist");
    }
  }, []);

  return (
    <div className="flex justify-center items-center my-20 text-center ">
      {/* left container */}
      <div className="w-1/2 ">
        <h1 className="text-6xl font-bold p-4">Build. Collab. Manage.</h1>
        <p className="p-4 text-lg">
          Build and manage your projects with ease, share workspaces and
          collaborate, and much more...
        </p>
        <Link href="/sign-in">
          <Button className="bg-orange-800 hover:bg-orange-700">
            Get Started
          </Button>
        </Link>{" "}
      </div>
    </div>
  );
}
