import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Children, ReactNode } from "react";

interface HintProps {
  tooltip: string;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
  sideOffset?: number;
}

export function Hint({
  children,
  tooltip,
  sideOffset = 0,
  position = "top",
}: HintProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={position} sideOffset={sideOffset}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
