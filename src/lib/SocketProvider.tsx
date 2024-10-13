"use client"

import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useMemo(()=> io("localhost:5321"), []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};