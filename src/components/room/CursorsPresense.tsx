"use client";

import React, { memo } from "react";
import { useOthersConnectionIds } from "@liveblocks/react";
import Cursor from "./Cursor";

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

const CursorsPresense = memo(() => {
  return (
    <>
      {/* todo: draft pensol component */}

      <Cursors />
    </>
  );
});

CursorsPresense.displayName = "CursorsPresense";

export default CursorsPresense;
