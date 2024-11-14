"use client";
import HomeCanvas from "@/components/custom/HomeCanvas";
import { Button } from "@/components/ui/button";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const Home = () => {
  const router = useRouter();
  return (
    <div className="relative flex justify-center items-center h-screen w-screen animated-gradient-bg ">
      <div className="flex flex-col justify-center items-center h-full text-white py-12 px-4 pt-16 md:px-16 lg:px-32 gap-12 ">
        <div className="flex flex-col md:flex-row items-center md:space-x-12 max-md:pt-80">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-center md:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Not Just Another <br />
              <span className="text-blue-500">Collab</span> Tool
            </h1>
            <p className="mt-6 text-lg md:text-2xl lg:text-3xl text-gray-300 font-semibold">
              Your <span className="text-blue-500">All-in-One</span>{" "}
              Collaboration Hub with inbuilt{" "}
              <span className="text-pink-600">Video Communication</span> and
              Real-Time Sync.
            </p>
            <div className="max-md:w-full max-md:flex max-md:justify-center">
              {" "}
              <Button
                onClick={() => router.push("/sign-up")}
                className="mt-8 px-8 py-3  bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                Onboard Now
              </Button>
            </div>
          </div>
          <div className="w-full max-md:hidden md:w-1/2  ">
            <HomeCanvas />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-blue-500">
              Real-Time Sync
            </h3>
            <p className="mt-3 text-gray-400">
              Seamlessly collaborate with real-time updates, ensuring everyone’s
              on the same page.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-pink-600">
              Video Communication
            </h3>
            <p className="mt-3 text-gray-400">
              Inbuilt video conferencing to discuss ideas without switching
              tools.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-500">
              Task Management
            </h3>
            <p className="mt-3 text-gray-400">
              Built-in task lists and project boards to keep track of your
              team’s progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
