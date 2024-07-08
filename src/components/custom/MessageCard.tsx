import React from "react";
import { Button } from "../ui/button";

const MessageCard = ({ project, status }: any) => {
  return (
    <div>
      <h1>
        You have been requested to colloborate on project:{" "}
        <span>{project}</span>
      </h1>
      <div className="flex">
        <Button>Accept</Button>
        <Button>Decline</Button>
      </div>
    </div>
  );
};

export default MessageCard;
