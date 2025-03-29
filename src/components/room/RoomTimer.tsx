"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRoom, useStorage, useMutation } from "@liveblocks/react/suspense";
import { LiveMap, LiveObject, LiveList } from "@liveblocks/client";
import { Layer } from "@/types/canvas";

//todo: the expiration logic should be on server side

// Timer wrapper component
const RoomTimer = ({ children }: { children: ReactNode }) => {
  const room = useRoom();
  const expirationTime = useStorage((root) => root?.expirationTime);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  // Mutation to clear room data
  const clearRoom = useMutation(({ storage }) => {
    // Clear all layers
    storage.set("layers", new LiveMap<string, LiveObject<Layer>>());
    // Clear layer IDs
    storage.set("layerIds", new LiveList<string>([]));
    // You can add more cleanup here for other storage items
  }, []);

  useEffect(() => {
    if (!expirationTime) return;

    const checkExpiration = () => {
      const remaining = Math.max(0, expirationTime - Date.now());

      if (remaining <= 0) {
        // Clear all room data before expiring
        clearRoom();
        setIsExpired(true);
        room.disconnect();
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    const interval = setInterval(checkExpiration, 1000);
    checkExpiration(); // Initial check

    return () => clearInterval(interval);
  }, [expirationTime, room, clearRoom]);

  // Add warning when close to expiration
  useEffect(() => {
    if (!expirationTime) return;

    const checkWarning = () => {
      const remaining = expirationTime - Date.now();
      if (remaining <= 60000 && remaining > 0) {
        // Last minute warning
        // You can add a visual warning here
        console.log("Room will expire in less than a minute!");
      }
    };

    const warningInterval = setInterval(checkWarning, 10000);
    return () => clearInterval(warningInterval);
  }, [expirationTime]);

  if (isExpired) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-4">
          <h2 className="text-xl font-semibold mb-2">Room Expired</h2>
          <p className="text-gray-600">
            This room has been cleared and is no longer available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {timeLeft && (
        <div
          className={`absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-md
          ${
            parseInt(timeLeft.split(":")[0]) === 0 &&
            parseInt(timeLeft.split(":")[1]) <= 60
              ? "bg-red-50 text-red-600"
              : ""
          }`}
        >
          <span className="text-sm font-medium">Time left: {timeLeft}</span>
        </div>
      )}
      {children}
    </div>
  );
};

export default RoomTimer;
