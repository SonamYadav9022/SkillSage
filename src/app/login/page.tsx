"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMsg("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      router.replace("/dashboard");
    } else {
      setMsg("Wrong email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-100 flex items-center justify-center px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md -mt-16 space-y-4"
      >
        <div className="flex justify-center mb-2">
          <img
            src="/logo.png"
            alt="SkillSage"
            className="w-22 h-22 rounded-2xl shadow-lg"
          />
        </div>

        <h1 className="text-4xl font-bold text-center text-gray-800 whitespace-nowrap">
          Welcome back to <span className="text-blue-600">SkillSage</span>
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Login to continue your journey
        </p>

        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-xl border bg-white"
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-xl border bg-white"
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold">
          {loading ? "Checking..." : "Login"}
        </button>

        {msg && (
          <p className="text-red-500 text-center text-sm">
            {msg}
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
          Want to create an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}