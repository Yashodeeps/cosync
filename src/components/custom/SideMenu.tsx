"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import path from "path";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const SideMenu = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="p-4 m-4 border text-base border-gray-700 shadow-lg rounded-lg h-full text-zinc-300 mt-24 ">
      <ul className="space-y-3">
        <li
          onClick={() => {
            router.push("/projects");
          }}
          className={
            pathname.endsWith("/projects")
              ? " hover:bg-black bg-zinc-800 rounded-lg cursor-pointer px-3 py-2"
              : "hover:bg-black rounded-lg cursor-pointer  px-3 py-2"
          }
        >
          Projects
        </li>
        {/* <li
          onClick={() => {
            // router.push("/board");
            alert("Board feature is taken down for now");
          }}
          className={
            pathname.endsWith("/board")
              ? " hover:bg-black bg-zinc-800 rounded-lg cursor-pointer px-3 py-2"
              : "hover:bg-black rounded-lg cursor-pointer  px-3 py-2"
          }
        >
          board
        </li> */}
      </ul>
    </div>
  );
};

export default SideMenu;
