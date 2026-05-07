"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex gap-3 items-center">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {session.user?.name?.charAt(0) || "U"}
        </div>

        <button
          onClick={() => signOut()}
          className="px-4 py-2 rounded-xl border"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Link
        href="/login"
        className="px-4 py-2 rounded-xl border"
      >
        Login
      </Link>

      <Link
        href="/signup"
        className="px-4 py-2 rounded-xl bg-blue-600 text-white"
      >
        Sign Up
      </Link>
    </div>
  );
}