"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <main className="h-screen overflow-hidden bg-[#dfe6f5] flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="SkillSage"
            width={42}
            height={42}
            className="rounded-xl"
          />

          <h1 className="text-3xl font-bold text-gray-900">
            SkillSage
          </h1>

          <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
            AI-Powered
          </span>
        </div>

        <div className="flex items-center gap-3">

          <Link
          href="/my-courses"
          className="px-4 py-2 rounded-xl border border-gray-300 bg-white"
          >
          My Courses
          </Link>

          <Link
          href="counselor"
          className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition"
          >
          Career Counselor
          </Link>
          
          {session ? (
            <>
              <Link
              href="/profile"
              className="px-4 py-2 rounded-xl bg-gray-100 font-medium"
              >
              {session.user?.name || 'Profile'}
            </Link>

            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Content */}
      <section className="flex-1 max-w-7xl mx-auto px-8 py-6 w-full flex flex-col justify-between">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Your AI-Powered Career Roadmap Generator
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Get personalized career guidance tailored to your skills and goals.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 min-h-[280px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              What SkillSage Does
            </h2>

            <p className="text-[20px] font-bold text-gray-700 leading-tight overflow-hidden whitespace-nowrap animate-typing">
              SkillSage turns confusion into direction!
            </p>

            <br />

            <p className="text-gray-600 leading-8 text-lg">
              SkillSage analyzes your skills, interests, learning stage,
              and career goals to generate a personalized roadmap.
            </p>

            <p className="text-gray-600 leading-8 text-lg mt-4">
              No random confusion. Only clear direction, milestones,
              and next steps.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 min-h-[280px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Why Students Love It
            </h2>

            <ul className="space-y-4 text-lg text-gray-700">
              <li>✓ AI-based career guidance</li>
              <li>✓ Personalized skill roadmaps</li>
              <li>✓ Resume & growth analysis</li>
              <li>✓ Placement focused progress</li>
              <li>✓ Clear future direction</li>
              <li>✓ Smart next steps</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl p-5 mt-4 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to Build Your Future?
          </h2>

          <p className="text-gray-600 mt-2 text-lg">
            Stop guessing. Start growing with a roadmap made for you.
          </p>

          <button
           onClick={() =>
           router.push(session ? "/dashboard" : "/signup")
           }
           className="inline-block mt-4 px-8 py-3 rounded-2xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 hover:-translate-y-1 transition"
          >
          Create My Path
          </button>
        </div>
      </section>
    </main>
  );
}