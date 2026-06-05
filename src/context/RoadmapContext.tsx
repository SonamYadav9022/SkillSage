"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

interface RoadmapContextType {

  selectedGoal: string

  selectedTimeline: string

  roadmap: any

  completedTasks: Record<
    string,
    boolean
  >

  setSelectedGoal: (
    goal: string
  ) => void

  setSelectedTimeline: (
    timeline: string
  ) => void

  setRoadmap: (
    roadmap: any
  ) => void

  toggleTask: (
    taskId: string
  ) => void

  clearRoadmap: () => void
}

const RoadmapContext =
  createContext<
    RoadmapContextType | undefined
  >(undefined)

export function RoadmapProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const [selectedGoal, setSelectedGoal] =
    useState("")

  const [
    selectedTimeline,
    setSelectedTimeline,
  ] = useState("")

  const [roadmap, setRoadmap] =
    useState<any>(null)

  const [
    completedTasks,
    setCompletedTasks,
  ] = useState<
    Record<string, boolean>
  >({})

  // LOAD FROM LOCALSTORAGE

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "skillsage-roadmap-state"
      )

    if (saved) {

      const parsed =
        JSON.parse(saved)

      setSelectedGoal(
        parsed.selectedGoal || ""
      )

      setSelectedTimeline(
        parsed.selectedTimeline || ""
      )

      setRoadmap(
        parsed.roadmap || null
      )

      setCompletedTasks(
        parsed.completedTasks || {}
      )
    }

  }, [])

  // SAVE TO LOCALSTORAGE

  useEffect(() => {

    localStorage.setItem(
      "skillsage-roadmap-state",

      JSON.stringify({
        selectedGoal,
        selectedTimeline,
        roadmap,
        completedTasks,
      })
    )

  }, [
    selectedGoal,
    selectedTimeline,
    roadmap,
    completedTasks,
  ])

  const toggleTask = (
    taskId: string
  ) => {

    setCompletedTasks(
      (prev) => ({
        ...prev,

        [taskId]:
          !prev[taskId],
      })
    )
  }

  const clearRoadmap =
    () => {

      setSelectedGoal("")
      setSelectedTimeline("")
      setRoadmap(null)
      setCompletedTasks({})

      localStorage.removeItem(
        "skillsage-roadmap-state"
      )
    }

  return (

    <RoadmapContext.Provider
      value={{
        selectedGoal,
        selectedTimeline,
        roadmap,
        completedTasks,

        setSelectedGoal,
        setSelectedTimeline,
        setRoadmap,

        toggleTask,

        clearRoadmap,
      }}
    >

      {children}

    </RoadmapContext.Provider>
  )
}

export function useRoadmap() {

  const context =
    useContext(
      RoadmapContext
    )

  if (!context) {

    throw new Error(
      "useRoadmap must be used inside RoadmapProvider"
    )
  }

  return context
}