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
    <div
      className={`flex flex-col md:flex-row h-full  gap-12 items-center justify-center mt-40`}
    >
      <div className="mx-8 w-full md:w-1/2 flex flex-col justify-center items-center  max-md:mt-52 z-30">
        <div className="">
          <h1 className="text-5xl md:text-6xl font-semibold text-white ">
            Not Just another <br />
            <span className="text-blue-500 text-6xl md:text-8xl">
              Collab
            </span>{" "}
            Tool
          </h1>
          <div className="flex justify-start">
            <p className=" mt-4 text-lg md:text-2xl text-gray-200 font-bold ">
              Your
              <span className="text-blue-500"> All-in-One </span>
              Collab Hub with
              <br /> inbuilt
              <span className="text-pink-700"> Video Communication</span>
            </p>
          </div>
          <Button
            onClick={() => {
              router.push("/sign-up");
            }}
            className={`my-6 w-fit px-4  ${orbitron.className}`}
          >
            Onboard Now
          </Button>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <HomeCanvas />
      </div>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
};

export default Home;
