'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

import {
  PlayCircle,
  TrendingUp,
  X,
  BookOpen,
  Layers,
  Target,
} from 'lucide-react'

export default function MyCoursesPage() {
  const [userData, setUserData] =
    useState<any>(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const res =
      await fetch('/api/user/me')

    const data =
      await res.json()

    setUserData(data)
  }

  const removeCourse =
    async (courseName: string) => {
      const courses =
        userData.selectedCourse
          .split(',')
          .map((c: string) =>
            c.trim()
          )
          .filter(
            (c: string) =>
              c !== courseName
          )

      await fetch(
        '/api/user/remove-course',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            selectedCourse:
              courses.join(','),
          }),
        }
      )

      loadUser()
    }

  const selectedCourses =
    userData?.selectedCourse
      ? userData.selectedCourse
          .split(',')
          .map((item: string) =>
            item.trim()
          )
          .filter(Boolean)
      : []

  const duration =
    userData?.selectedDuration ||
    'Not Selected'

  const getProgress = (
    index: number
  ) => {
    const arr = [35, 48, 62, 78]
    return arr[index % 4]
  }

  const getDetails = (
    course: string
  ) => {
    const lower =
      course.toLowerCase()

    if (
      lower.includes('ai') ||
      lower.includes(
        'artificial'
      )
    ) {
      return {
        category:
          'Artificial Intelligence',
        level:
          'Intermediate',
        desc:
          'Learn machine learning, neural networks, prompt engineering and AI tools.',
        skills:
          'Python, ML, NLP',
      }
    }

    if (
      lower.includes('web')
    ) {
      return {
        category:
          'Web Development',
        level:
          'Beginner',
        desc:
          'Master frontend and backend development with modern frameworks.',
        skills:
          'HTML, CSS, React',
      }
    }

    if (
      lower.includes('data')
    ) {
      return {
        category:
          'Data Science',
        level:
          'Intermediate',
        desc:
          'Analyze data, build models and create dashboards.',
        skills:
          'Python, SQL, Pandas',
      }
    }

    return {
      category:
        'Professional Course',
      level:
        'Beginner',
      desc:
        'Build strong practical skills and become industry ready.',
      skills:
        'Projects, Tools, Practice',
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-8 py-10 transition-colors duration-300">

      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="space-y-8">

          <div className="flex items-center gap-6">

            <Image
              src="/logo.png"
              alt="SkillSage"
              width={95}
              height={95}
              className="rounded-2xl shadow-md"
            />

            <p className="text-xl font-semibold text-foreground">
              Today with more energy,
              one lesson closer to success 🚀
            </p>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-foreground">
              My Courses
            </h1>

            <p className="text-muted-foreground mt-2 text-lg">
              Track your learning
              journey beautifully
            </p>
          </div>
        </div>

        {/* EMPTY */}
        {selectedCourses.length ===
          0 && (
          <Card className="rounded-2xl shadow-md border border-border bg-card">
            <CardContent className="p-10 text-center">
              <h3 className="text-2xl font-semibold text-foreground">
                No Courses Yet
              </h3>

              <p className="text-muted-foreground mt-2">
                Select courses from
                dashboard first.
              </p>
            </CardContent>
          </Card>
        )}

        {/* CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {selectedCourses.map(
            (
              course: string,
              index: number
            ) => {
              const progress =
                getProgress(
                  index
                )

              const details =
                getDetails(
                  course
                )

              return (
                <Card
                  key={index}
                  className="rounded-2xl shadow-md border border-border bg-card hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader>

                    <div className="flex justify-between gap-3">

                      <div>
                        <CardTitle className="text-xl leading-snug text-foreground">
                          {course}
                        </CardTitle>

                        <p className="text-sm text-muted-foreground mt-1">
                          {
                            details.category
                          }
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          removeCourse(
                            course
                          )
                        }
                      >
                        <X className="w-5 h-5 text-red-500 hover:scale-110 transition" />
                      </button>

                    </div>

                  </CardHeader>

                  <CardContent className="space-y-5">

                    {/* BADGES */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-[#6d8cff] text-white">
                        {duration}
                      </Badge>

                      <Badge variant="outline">
                        {
                          details.level
                        }
                      </Badge>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-3 text-sm text-muted-foreground">

                      <div className="flex gap-2">
                        <BookOpen className="w-4 h-4 mt-0.5 text-[#6d8cff]" />
                        <span>
                          {
                            details.desc
                          }
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Layers className="w-4 h-4 mt-0.5 text-[#6d8cff]" />
                        <span>
                          Skills:{' '}
                          {
                            details.skills
                          }
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Target className="w-4 h-4 mt-0.5 text-[#6d8cff]" />
                        <span>
                          Goal:
                          Become
                          job-ready
                        </span>
                      </div>

                    </div>

                    {/* PROGRESS */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Completed
                        </span>

                        <span className="font-semibold text-foreground">
                          {
                            progress
                          }
                          %
                        </span>
                      </div>

                      <Progress
                        value={
                          progress
                        }
                        className="h-3"
                      />
                    </div>

                    {/* BUTTON */}
                    <a
                      href={`https://www.youtube.com/results?search_query=${course}+full+course`}
                      target="_blank"
                    >
                      <Button className="w-full bg-[#6d8cff] hover:bg-[#5c74ef] rounded-xl">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Learn on YouTube
                      </Button>
                    </a>

                    {/* FOOTER */}
                    <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      Keep growing daily
                    </div>

                  </CardContent>
                </Card>
              )
            }
          )}

        </div>
      </div>
    </div>
  )
}