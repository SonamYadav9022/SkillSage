'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Calendar
} from 'lucide-react'

interface RoadmapDisplayProps {
  roadmap: any
}

export default function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
  const [activeMilestone, setActiveMilestone] = useState(1)

  const completedMilestones = 0 // This would come from user progress data
  const totalMilestones = roadmap.milestones.length
  const overallProgress = (completedMilestones / totalMilestones) * 100

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-blue-900">{roadmap.title}</CardTitle>
              <CardDescription className="text-blue-700">
                Duration: {roadmap.duration} • {totalMilestones} Milestones
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-900">{overallProgress.toFixed(0)}%</div>
              <div className="text-sm text-blue-700">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
          <p className="text-sm text-blue-700 mt-2">
            {completedMilestones} of {totalMilestones} milestones completed
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="milestones" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="milestones">Learning Path</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="advice">Tips & Advice</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-6">
          {/* Milestone Navigation */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {roadmap.milestones.map((milestone: any) => (
              <Button
                key={milestone.id}
                variant={activeMilestone === milestone.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveMilestone(milestone.id)}
                className="whitespace-nowrap"
              >
                {milestone.completed ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Circle className="w-4 h-4 mr-2" />
                )}
                {milestone.title}
              </Button>
            ))}
          </div>

          {/* Active Milestone Details */}
          {roadmap.milestones.map((milestone: any) => (
            activeMilestone === milestone.id && (
              <Card key={milestone.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {milestone.completed ? (
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      ) : (
                        <Circle className="w-8 h-8 text-gray-400" />
                      )}
                      <div>
                        <CardTitle className="text-xl">{milestone.title}</CardTitle>
                        <CardDescription>{milestone.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {milestone.duration}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Skills to Learn */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Skills to Master
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {milestone.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Courses */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Recommended Courses
                    </h4>
                    <div className="space-y-3">
                      {milestone.courses.map((course: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium">{course.title}</h5>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-gray-600">{course.provider}</span>
                                <span className="text-sm text-gray-600">{course.duration}</span>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="text-sm">{course.rating}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Course
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Learning Resources */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Additional Resources
                    </h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {milestone.resources.map((resource: string, index: number) => (
                        <Card key={index} className="p-3 text-center">
                          <p className="text-sm font-medium">{resource}</p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button className="flex-1">
                      {milestone.completed ? 'Review Progress' : 'Start Learning'}
                    </Button>
                    <Button variant="outline">
                      Mark as Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* All Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  All Recommended Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {roadmap.milestones.flatMap((milestone: any) => 
                    milestone.courses.map((course: any, index: number) => (
                      <div key={`${milestone.id}-${index}`} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-sm">{course.title}</h5>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">{course.provider}</Badge>
                              <span className="text-xs text-gray-500">{course.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span className="text-xs">{course.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Learning Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {Array.from(new Set(roadmap.milestones.flatMap((milestone: any) => milestone.resources)))
                    .map((resource, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <p className="font-medium text-sm">{resource}</p>
                        <p className="text-xs text-gray-500 mt-1">Learning Platform</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advice" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roadmap.recommendations.tips.map((tip: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Career Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roadmap.recommendations.advice.map((advice: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-green-600">{index + 1}</span>
                      </div>
                      <p className="text-sm">{advice}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}