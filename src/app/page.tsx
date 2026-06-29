"use client";

import UserAvatar from '../components/UserAvatar'
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { ModeToggle } from "../components/toggle-mode";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground flex flex-col transition-colors duration-300">

      {/* Navbar */}
      <nav className="w-full bg-card border-b border-border px-8 py-3 flex items-center justify-between shadow-sm">

        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="SkillSage"
            width={42}
            height={42}
            className="rounded-xl"
          />

          <h1 className="text-3xl font-bold text-foreground">
            SkillSage
          </h1>

          <span className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
            AI-Powered
          </span>
        </div>

        <div className="flex items-center gap-3">

          {/* DARK MODE TOGGLE */}
          <ModeToggle />

          <Link
            href="/my-courses"
            className="px-4 py-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition"
          >
            My Courses
          </Link>

          <Link
            href="/counselor"
            className="px-4 py-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition"
          >
            Career Counselor
          </Link>

          {session ? (
            <>
              <UserAvatar
              name={session.user?.name || "User"}
              email={session.user?.email || ""}
              image={session.user?.image || ""}
            />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition"
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
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            Your AI-Powered Career Roadmap Generator
          </h1>

          <p className="mt-3 text-lg text-muted-foreground">
            Get personalized career guidance tailored to your skills and goals.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">

          {/* Card 1 */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 min-h-[280px]">

            <h2 className="text-3xl font-bold text-foreground mb-5">
              What SkillSage Does
            </h2>

            <p className="text-[20px] font-bold text-foreground leading-tight overflow-hidden whitespace-nowrap animate-typing">
              SkillSage turns confusion into direction!
            </p>

            <br />

            <p className="text-muted-foreground leading-8 text-lg">
              SkillSage analyzes your skills, interests, learning stage,
              and career goals to generate a personalized roadmap.
            </p>

            <p className="text-muted-foreground leading-8 text-lg mt-4">
              No random confusion. Only clear direction, milestones,
              and next steps.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 min-h-[280px]">

            <h2 className="text-3xl font-bold text-foreground mb-5">
              Why Students Love It
            </h2>

            <ul className="space-y-4 text-lg text-muted-foreground">
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
        <div className="bg-card border border-border rounded-2xl p-5 mt-4 text-center shadow-sm">

          <h2 className="text-3xl font-bold text-foreground">
            Ready to Build Your Future?
          </h2>

          <p className="text-muted-foreground mt-2 text-lg">
            Stop guessing. Start growing with a roadmap made for you.
          </p>

          <button
            onClick={() =>
              router.push(session ? "/dashboard" : "/signup")
            }
            className="inline-block mt-4 px-8 py-3 rounded-2xl bg-primary text-primary-foreground text-lg font-semibold hover:opacity-90 hover:-translate-y-1 transition"
          >
            Create My Path
          </button>
        </div>
      </section>
    </main>
  );
}