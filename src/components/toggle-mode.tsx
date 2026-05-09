"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      onClick={() =>
        setTheme(
          resolvedTheme === "dark"
            ? "light"
            : "dark"
        )
      }
      className="flex items-center justify-center p-2 rounded-xl border border-black dark:border-white bg-white dark:bg-zinc-900 text-black dark:text-white"
    >
      {resolvedTheme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  )
}