"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  // const user: User = session?.user;
  useEffect(() => {
    if (session && session.user) {
      setUser(session.user as User);
    }
  }, [session]);

  const handleSignOut = async () => {
    const data = await signOut({
      redirect: false,
      callbackUrl: "/",
    });
    if (!data) {
      console.log("Sign out falied");
    }
    router.replace("/");
  };

  return (
    <nav className="p-3 md:p-4 shadow-md border-b-2 border-gray-700">
      <div className=" mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl font-bold text-gray-500">CoSyncLabs</div>
        {session ? (
          <div>
            <Button className="w-full md:w-auto" onClick={handleSignOut}>
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button>Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
