'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

import {
  Target,
  Calendar,
  Clock,
  TrendingUp,
  Code,
  Palette,
  Briefcase,
  Heart,
  Cpu,
  Scale,
  FlaskConical,
  Cog,
  Leaf,
} from 'lucide-react'

import { courses } from '@/lib/courses'

interface GoalSettingProps {
  onGoalSet: (data: any) => void
  currentSkills: string[]
  savedGoal?: string
  savedDuration?: string
}

const durationOptions = [
  {
    label: '3 Months',
    value: '3 months',
    description: 'Fast intensive path',
  },
  {
    label: '6 Months',
    value: '6 months',
    description: 'Balanced growth path',
  },
  {
    label: '1 Year',
    value: '1 year',
    description: 'Deep learning roadmap',
  },
  {
    label: '2 Years',
    value: '2 years',
    description: 'Mastery focused path',
  },
]

export default function GoalSetting({
  onGoalSet,
  currentSkills = [],
  savedGoal = '',
  savedDuration = '',
}: GoalSettingProps) {
  const [step, setStep] = useState(
    savedDuration ? 3 : savedGoal ? 2 : 1
  )

  const [selectedGoal, setSelectedGoal] =
    useState(savedGoal)

  const [customGoal, setCustomGoal] =
    useState('')

  const [selectedDuration, setSelectedDuration] =
    useState(savedDuration || '')

  /* SAVED COURSES ARRAY */
  const selectedCourses =
    savedGoal
      ? savedGoal
          .split(',')
          .map((item) =>
            item.trim()
          )
          .filter(Boolean)
      : []

  useEffect(() => {
    if (savedGoal) {
      setSelectedGoal(savedGoal)
    }

    if (savedDuration) {
      setSelectedDuration(
        savedDuration
      )
    }

    if (savedDuration) {
      setStep(3)
    } else if (savedGoal) {
      setStep(2)
    }
  }, [savedGoal, savedDuration])

  const getDemandClass = (
    demand: string
  ) => {
    if (demand === 'Very High')
      return 'bg-green-600 text-white'

    if (demand === 'High')
      return 'bg-blue-600 text-white'

    if (demand === 'Medium')
      return 'bg-yellow-500 text-white'

    return 'bg-gray-200 text-gray-800'
  }

  const getIcon = (
    category: string
  ) => {
    switch (category) {
      case 'Technology':
        return (
          <Code className="w-7 h-7 text-blue-600" />
        )

      case 'Arts & Creativity':
        return (
          <Palette className="w-7 h-7 text-pink-600" />
        )

      case 'Commerce & Business':
        return (
          <Briefcase className="w-7 h-7 text-green-600" />
        )

      case 'Health':
        return (
          <Heart className="w-7 h-7 text-red-600" />
        )

      case 'Law & Public Service':
        return (
          <Scale className="w-7 h-7 text-purple-600" />
        )

      case 'Science':
        return (
          <FlaskConical className="w-7 h-7 text-cyan-600" />
        )

      case 'Engineering':
        return (
          <Cog className="w-7 h-7 text-orange-600" />
        )

      case 'Nature & Research':
        return (
          <Leaf className="w-7 h-7 text-green-700" />
        )

      default:
        return (
          <Cpu className="w-7 h-7 text-gray-700" />
        )
    }
  }

  const recommendedCourses =
    useMemo(() => {
      const filtered =
        courses.filter(
          (course: any) =>
            currentSkills?.includes(
              course.skill
            )
        )

      return filtered.length
        ? filtered
        : courses.slice(0, 12)
    }, [currentSkills])

  const handleGoalSelect =
    async (title: string) => {
      setSelectedGoal(title)

      await fetch(
        '/api/user/save-course',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            selectedCourse:
              title,
            goal:
              selectedCourses.length
                ? `${savedGoal},${title}`
                : title,
          }),
        }
      )

      setStep(2)
    }

  const handleDurationSelect =
    async (
      duration: string
    ) => {
      setSelectedDuration(
        duration
      )

      await fetch(
        '/api/user/save-duration',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            selectedDuration:
              duration,
          }),
        }
      )

      setStep(3)
    }

  const handleSubmit =
    async () => {
      const roadmap = {
        title: selectedGoal,
        duration:
          selectedDuration,

        milestones: [
          {
            id: 1,
            title:
              'Foundation',
            description:
              'Learn basics',
          },
          {
            id: 2,
            title:
              'Intermediate',
            description:
              'Build projects',
          },
          {
            id: 3,
            title:
              'Advanced',
            description:
              'Industry ready',
          },
        ],
      }

      await fetch(
        '/api/user/save-roadmap',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            roadmapData:
              roadmap,
          }),
        }
      )

      onGoalSet({
        goal:
          savedGoal,
        duration:
          selectedDuration,
        roadmap,
      })
    }

  return (
    <div className="space-y-6">

      {/* TOP STEPS */}
      <div className="flex justify-center gap-8 text-sm font-semibold">

        <button
          onClick={() =>
            setStep(1)
          }
          className={
            step === 1
              ? 'text-blue-600'
              : savedGoal
              ? 'text-green-600'
              : 'text-gray-400'
          }
        >
          1 Goal
        </button>

        <button
          onClick={() =>
            savedGoal &&
            setStep(2)
          }
          className={
            step === 2
              ? 'text-blue-600'
              : selectedDuration
              ? 'text-green-600'
              : 'text-gray-400'
          }
        >
          2 Duration
        </button>

        <button
          onClick={() => {
            if (
              savedGoal &&
              selectedDuration
            ) {
              setStep(3)
            }
          }}
          className={
            step === 3
              ? 'text-blue-600'
              : selectedDuration
              ? 'text-green-600'
              : 'text-gray-400'
          }
        >
          3 Roadmap
        </button>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Target className="w-5 h-5" />
              What's Your Career Goal?
            </CardTitle>

            <CardDescription>
              Select multiple courses
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

              {recommendedCourses.map(
                (course: any) => {
                  const isSelected =
                    selectedCourses.includes(
                      course.title
                    )

                  return (
                    <Card
                      key={
                        course.id
                      }
                      onClick={() =>
                        handleGoalSelect(
                          course.title
                        )
                      }
                      className={`cursor-pointer transition hover:shadow-lg hover:-translate-y-1 ${
                        isSelected
                          ? 'ring-2 ring-green-500 bg-green-50'
                          : ''
                      }`}
                    >
                      <CardContent className="p-4">

                        <div className="flex justify-between mb-3">
                          {getIcon(
                            course.category
                          )}

                          <Badge
                            className={getDemandClass(
                              course.demand
                            )}
                          >
                            {
                              course.demand
                            }
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-lg">
                          {
                            course.title
                          }
                        </h3>

                        <p className="text-sm text-gray-600 mt-1 mb-3">
                          {
                            course.description
                          }
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">
                            {
                              course.type
                            }
                          </Badge>

                          <Badge variant="outline">
                            {
                              course.duration
                            }
                          </Badge>

                          {isSelected && (
                            <Badge className="bg-green-600 text-white">
                              Selected
                            </Badge>
                          )}
                        </div>

                      </CardContent>
                    </Card>
                  )
                }
              )}

            </div>

            {/* CUSTOM */}
            <div className="border-t mt-8 pt-5">
              <p className="text-sm font-medium mb-3">
                Or define your own goal
              </p>

              <div className="flex gap-2">
                <Input
                  value={
                    customGoal
                  }
                  onChange={(
                    e
                  ) =>
                    setCustomGoal(
                      e.target
                        .value
                    )
                  }
                />

                <Button
                  onClick={() =>
                    handleGoalSelect(
                      customGoal
                    )
                  }
                >
                  Use Goal
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Select Timeline
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

              {durationOptions.map(
                (item) => (
                  <Card
                    key={
                      item.value
                    }
                    onClick={() =>
                      handleDurationSelect(
                        item.value
                      )
                    }
                    className={`cursor-pointer ${
                      selectedDuration ===
                      item.value
                        ? 'ring-2 ring-green-500 bg-green-50'
                        : ''
                    }`}
                  >
                    <CardContent className="p-4 text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />

                      <h3 className="font-semibold">
                        {
                          item.label
                        }
                      </h3>

                      <p className="text-sm text-gray-600">
                        {
                          item.description
                        }
                      </p>
                    </CardContent>
                  </Card>
                )
              )}

            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Generate Roadmap
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">

            <div className="bg-gray-50 p-5 rounded-xl">
              <p>
                <b>
                  Courses:
                </b>{' '}
                {
                  savedGoal
                }
              </p>

              <p>
                <b>
                  Duration:
                </b>{' '}
                {
                  selectedDuration
                }
              </p>
            </div>

            <Button
              onClick={
                handleSubmit
              }
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Generate My Roadmap
            </Button>

          </CardContent>
        </Card>
      )}
    </div>
  )
}