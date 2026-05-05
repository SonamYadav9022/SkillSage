'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import {
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  ExternalLink,
  Star,
  Target,
  Lightbulb,
  Award,
} from 'lucide-react'

interface RoadmapDisplayProps {
  roadmap: any
  onStartLearning?: () => void
}

export default function RoadmapDisplay({
  roadmap,
  onStartLearning,
}: RoadmapDisplayProps) {
  /* ---------- SAFETY ---------- */

  if (
    !roadmap ||
    !roadmap.milestones ||
    !Array.isArray(roadmap.milestones)
  ) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <h2 className="text-xl font-semibold mb-2">
            No Roadmap Found
          </h2>
          <p className="text-gray-500">
            Please select a course and generate roadmap first.
          </p>
        </CardContent>
      </Card>
    )
  }

  const [activeMilestone, setActiveMilestone] =
    useState(
      roadmap.milestones[0]?.id || 1
    )

  const completedMilestones =
    roadmap.milestones.filter(
      (m: any) => m.completed
    ).length

  const totalMilestones =
    roadmap.milestones.length

  const overallProgress =
    totalMilestones > 0
      ? (completedMilestones /
          totalMilestones) *
        100
      : 0

  const currentMilestone =
    roadmap.milestones.find(
      (m: any) =>
        m.id === activeMilestone
    )

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <div>
              <CardTitle className="text-2xl text-blue-900">
                {roadmap.title}
              </CardTitle>

              <CardDescription className="text-blue-700 mt-1">
                Duration: {roadmap.duration} •{' '}
                {totalMilestones} Milestones
              </CardDescription>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-blue-900">
                {overallProgress.toFixed(
                  0
                )}
                %
              </p>

              <p className="text-sm text-blue-700">
                Complete
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Progress
            value={overallProgress}
            className="h-3"
          />

          <p className="text-sm text-blue-700 mt-2">
            {completedMilestones} of{' '}
            {totalMilestones} milestones completed
          </p>
        </CardContent>
      </Card>

      {/* TABS */}
      <Tabs
        defaultValue="milestones"
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="milestones">
            Learning Path
          </TabsTrigger>

          <TabsTrigger value="resources">
            Resources
          </TabsTrigger>

          <TabsTrigger value="advice">
            Tips & Advice
          </TabsTrigger>
        </TabsList>

        {/* MILESTONES */}
        <TabsContent value="milestones">
          <div className="space-y-6">

            {/* NAV */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {roadmap.milestones.map(
                (milestone: any) => (
                  <Button
                    key={milestone.id}
                    size="sm"
                    variant={
                      activeMilestone ===
                      milestone.id
                        ? 'default'
                        : 'outline'
                    }
                    onClick={() =>
                      setActiveMilestone(
                        milestone.id
                      )
                    }
                  >
                    {milestone.completed ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <Circle className="w-4 h-4 mr-2" />
                    )}

                    {milestone.title}
                  </Button>
                )
              )}
            </div>

            {/* ACTIVE CARD */}
            {currentMilestone && (
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between gap-4">

                    <div>
                      <CardTitle>
                        {
                          currentMilestone.title
                        }
                      </CardTitle>

                      <CardDescription>
                        {
                          currentMilestone.description
                        }
                      </CardDescription>
                    </div>

                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {
                        currentMilestone.duration
                      }
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">

                  {/* SKILLS */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Skills to Master
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {currentMilestone.skills?.map(
                        (
                          skill: string,
                          i: number
                        ) => (
                          <Badge
                            key={i}
                            variant="secondary"
                          >
                            {skill}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  {/* COURSES */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Recommended Courses
                    </h4>

                    <div className="space-y-3">
                      {currentMilestone.courses?.map(
                        (
                          course: any,
                          i: number
                        ) => (
                          <Card
                            key={i}
                            className="p-4"
                          >
                            <div className="flex justify-between gap-4">

                              <div>
                                <h5 className="font-medium">
                                  {
                                    course.title
                                  }
                                </h5>

                                <div className="flex gap-3 mt-2 text-sm text-gray-500 flex-wrap">
                                  <span>
                                    {
                                      course.provider
                                    }
                                  </span>

                                  <span>
                                    {
                                      course.duration
                                    }
                                  </span>

                                  <span className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                    {
                                      course.rating
                                    }
                                  </span>
                                </div>
                              </div>

                              <Button
                                size="sm"
                                variant="outline"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </Card>
                        )
                      )}
                    </div>
                  </div>

                  {/* RESOURCES */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Additional Resources
                    </h4>

                    <div className="grid md:grid-cols-3 gap-3">
                      {currentMilestone.resources?.map(
                        (
                          item: string,
                          i: number
                        ) => (
                          <Card
                            key={i}
                            className="p-3 text-center"
                          >
                            <p className="text-sm font-medium">
                              {item}
                            </p>
                          </Card>
                        )
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <Button
                  className="flex-1"
                  onClick={onStartLearning}
                  >
                  Start Learning
                  </Button>
                  
                  <div>
                    <Button variant="outline">
                      Mark Complete
                    </Button>
                  </div>

                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* RESOURCES TAB */}
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>
                All Resources
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {roadmap.milestones.map(
                (
                  milestone: any,
                  idx: number
                ) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4"
                  >
                    <h4 className="font-semibold mb-2">
                      {
                        milestone.title
                      }
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {milestone.resources?.map(
                        (
                          r: string,
                          i: number
                        ) => (
                          <Badge
                            key={i}
                            variant="outline"
                          >
                            {r}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADVICE TAB */}
        <TabsContent value="advice">
          <div className="grid md:grid-cols-2 gap-6">

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Pro Tips
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {roadmap.recommendations?.tips?.map(
                  (
                    tip: string,
                    i: number
                  ) => (
                    <div
                      key={i}
                      className="flex gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>

                      <p className="text-sm">
                        {tip}
                      </p>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Career Advice
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {roadmap.recommendations?.advice?.map(
                  (
                    item: string,
                    i: number
                  ) => (
                    <div
                      key={i}
                      className="flex gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>

                      <p className="text-sm">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}