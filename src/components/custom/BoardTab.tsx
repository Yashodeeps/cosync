import React from "react";
import { TabsContent } from "../ui/tabs";

const BoardTab = ({ value }: { value: string }) => {
  return (
    <div>
      <TabsContent value={value}></TabsContent>
    </div>
  );
};

export default BoardTab;
