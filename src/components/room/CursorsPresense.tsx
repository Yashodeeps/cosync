"use client";

import React, { memo } from "react";
import { shallow, useOthersConnectionIds } from "@liveblocks/react";
import Cursor from "./Cursor";
import Path from "./objects/Path";
import { colorToCss } from "@/lib/utils";
import { useOthersMapped } from "@liveblocks/react";

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      penColor: other.presence.penColor,
    }),
    shallow
  );

  return (
    <>
      {others.map((other, key) => {
        if (other[1].pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other[1].pencilDraft}
              fill={
                other[1].penColor ? colorToCss(other[1].penColor) : "#FFFFFF"
              }
            />
          );
        }
        return null;
      })}
    </>
  );
};

const CursorsPresense = memo(() => {
  return (
    <>
      <Drafts />
      <Cursors />
    </>
  );
});

CursorsPresense.displayName = "CursorsPresense";

export default CursorsPresense;
