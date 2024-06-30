import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center my-20 text-center ">
      {/* left container */}
      <div className="w-1/2 text-gray-500">
        <h1 className="text-6xl font-bold p-4">Build. Collab. Manage.</h1>
        <p className="p-4 text-lg">
          Build and manage your projects with ease, share workspaces and
          collaborate, and much more...
        </p>
        <Link href="/sign-up">
          <Button className="bg-orange-800 hover:bg-orange-700">
            Get Started
          </Button>
        </Link>{" "}
      </div>
    </div>
  );
}
