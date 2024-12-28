"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";
import Image from "next/image";
import { Edit3, Save, Shield, Trello, Users, Video } from "lucide-react";

const Home = () => {
  const router = useRouter();

  return (
    <>
      <div className="relative flex justify-center items-center h-full p-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 animated-gradient-bg overflow-hidden">
        <div className="flex flex-col justify-center items-center h-full text-white py-12 px-4 pt-20 md:px-16 lg:px-32 gap-12">
          <div className="flex flex-col items-center justify-center md:space-x-12 max-md:pt-40">
            <div className="w-full  flex flex-col justify-center items-center text-center md:text-left">
              <div className="text-lg my-2 font-semibold text-purple-300">
                cosync labs
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white tracking-tight">
                The most convinient
                <span className="text-blue-400"> Meeting Rooms,</span> <br />
                <span className="text-center w-full flex justify-center my-1 text-4xl font-semibold">
                  {" "}
                  you ever join.
                </span>
              </h1>
              <p className="mt-6 md:text-lg lg:text-xl text-gray-200 text-center w-1/2">
                Simplify<span className="text-blue-300"> teamwork</span> with
                video calls, whiteboards, and task management
                <span className="text-pink-400"> —all in one place.</span>
              </p>
              <div className="max-md:w-full z-20 max-md:flex max-md:justify-center mb-8 flex gap-4 py-6">
                <Button
                  onClick={() => router.push("/sign-up")}
                  className="px-6 py-3 bg-gray-800 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-white transition-transform transform hover:scale-105"
                >
                  Onboard Now
                </Button>
                <Button
                  onClick={() => router.push("/sign-up")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-blue-500 hover:to-purple-500 transition-transform transform hover:scale-105"
                >
                  Try Instant meet
                </Button>
              </div>
            </div>

            <section className="w-full">
              <div className="container mx-auto px-4">
                <div className="relative aspect-video max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/board.png"
                    alt="CollabSpace Room Preview"
                    width={1280}
                    height={720}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Work Smarter Together
                    </h3>
                    <p className="text-gray-200">
                      All-in-one solution for video, brainstorming, and task
                      management.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="bg-gray-900">
            <section id="features" className="py-20  w-screen">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">
                  Feature Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-lg shadow-lg bg-gray-800 hover:scale-105 transition-transform"
                    >
                      <div className="mb-4 flex items-center justify-center h-12 w-12 bg-blue-900 rounded-full">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-20 bg-blue-600 text-center w-screen">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Revolutionize Your Workflow?
                </h2>
                <p className="text-lg text-blue-200 mb-8">
                  Join the thousands already boosting their productivity with
                  CollabSpace.
                </p>
                <Button
                  size="lg"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                  onClick={() => router.push("/sign-up")}
                >
                  Get Started Free
                </Button>
              </div>
            </section>
            <footer className=" py-20 w-screen h-full">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between">
                  <div className="w-full md:w-1/4 mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold mb-4">CollabSpace</h3>
                    <p className="text-gray-400">
                      Empowering teams to work better, together.
                    </p>
                  </div>

                  <div>Socials</div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                  <p>&copy; 2023 CollabSpace. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
          <div className="absolute top-0 left-0 w-full h-full z-10">
            <StarsBackground />
            <ShootingStars />
          </div>{" "}
        </div>
      </div>
    </>
  );
};

export default Home;

const features = [
  {
    icon: <Video className="h-6 w-6 text-blue-500" />,
    title: "Create Meeting Rooms",
    description:
      "Instantly set up virtual spaces for your team to collaborate.",
  },
  {
    icon: <Edit3 className="h-6 w-6 text-blue-500" />,
    title: "Real-time Whiteboards",
    description:
      "Brainstorm and visualize ideas together with integrated whiteboards.",
  },
  {
    icon: <Users className="h-6 w-6 text-blue-500" />,
    title: "Invite Members",
    description:
      "Easily add team members or guests to your collaboration rooms.",
  },
  {
    icon: <Shield className="h-6 w-6 text-blue-500" />,
    title: "Role-based Access",
    description:
      "Manage permissions and control access with customizable roles.",
  },
  {
    icon: <Save className="h-6 w-6 text-blue-500" />,
    title: "Save Rooms",
    description:
      "Preserve your work and continue where you left off in saved rooms.",
  },
  {
    icon: <Trello className="h-6 w-6 text-blue-500" />,
    title: "Basic Kanban",
    description:
      "Organize tasks and workflows with an integrated Kanban board.",
  },
];

