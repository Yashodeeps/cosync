"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
