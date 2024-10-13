import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center my-20 text-center ">
      {/* left container */}
      <div className="w-1/2 text-gray-500">
        <h1 className="text-6xl font-bold p-4">
          Not Just Another Collaboration Canvas
        </h1>
        <p className="p-4 text-lg">
          we provide a platform for developers to collaborate on projects with
          built in video, audio and chat support
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
