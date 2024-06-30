import { Dot } from "lucide-react";
import React from "react";

const CollaboratorMenu = ({ collaborators }: { collaborators: any[] }) => {
  return (
    <div className="p-4 m-4 border border-gray-700 shadow-lg rounded-lg h-full text-gray-200 ">
      <h1 className="text-xl font-semibold text-gray-500">Collaborators</h1>
      <ul className="mt-4 ">
        {collaborators.map((collaborator) => (
          <li key={collaborator.id} className="flex text-zinc-300 items-center">
            <Dot className="text-green-500" size={40} />{" "}
            {collaborator.user?.name || collaborator.user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaboratorMenu;
