"use client";
import HomeCanvas from "@/components/custom/HomeCanvas";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";
import { Img } from "@react-email/components";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import Head from "next/head";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const Home = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta property="og:title" content="cosync" />
        <meta property="og:description" content="a real-time workspace" />
        <meta property="og:image" content="/og.png" />
        <meta property="og:image:alt" content="workspace" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cosynclabs.com" />

        <meta name="twitter:card" content="real-time workspace" />
        <meta name="twitter:title" content="cosync" />
        <meta name="twitter:description" content="A real-time workspace tool" />
        <meta name="twitter:image" content="/og.png" />
      </Head>
      <div className="relative flex justify-center items-center h-full p-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 animated-gradient-bg overflow-hidden">
        <div className="flex flex-col justify-center items-center h-full text-white py-12 px-4 pt-20 md:px-16 lg:px-32 gap-12">
          <div className="flex flex-col items-center justify-center md:space-x-12 max-md:pt-40">
            <div className="w-full  flex flex-col justify-center items-center text-center md:text-left">
              <div className="text-lg my-2 font-semibold text-purple-300">
                cosync labs
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white tracking-tight">
                Your Digital
                <span className="text-blue-400"> Workspace,</span> <br />
                <span className="text-center w-full flex justify-center my-1 text-5xl font-semibold">
                  {" "}
                  Simplified.
                </span>
              </h1>
              <p className="mt-6 md:text-lg lg:text-xl text-gray-200 text-center">
                Your <span className="text-blue-300">All-in-One</span>{" "}
                Collaboration Hub with inbuilt{" "}
                <span className="text-pink-400">Video Communication</span> and
                Real-Time Sync.
              </p>
              <div className="max-md:w-full z-20 max-md:flex max-md:justify-center mb-8">
                <Button
                  onClick={() => router.push("/sign-up")}
                  className="mt-8 px-8 py-3 bg-blue-500  text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Onboard Now
                </Button>
              </div>
            </div>

            <div className="w-full m-4">
              <img
                src="/og.png"
                alt="Collaboration Tool Image"
                className="w-full rounded-xl shadow-xl transform hover:scale-105 transition duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
              <h3 className="text-xl font-semibold text-blue-300">
                Real-Time Sync
              </h3>
              <p className="mt-3 text-gray-400">
                Seamlessly collaborate with real-time updates, ensuring
                everyone’s on the same page.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
              <h3 className="text-xl font-semibold text-pink-400">
                Video Communication
              </h3>
              <p className="mt-3 text-gray-400">
                Inbuilt video conferencing to discuss ideas without switching
                tools.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
              <h3 className="text-xl font-semibold text-yellow-400">
                Task Management
              </h3>
              <p className="mt-3 text-gray-400">
                Built-in task lists and project boards to keep track of your
                team’s progress.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full z-10">
          <StarsBackground />
          <ShootingStars />
        </div>
      </div>
    </>
  );
};

export default Home;
