'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Calendar,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Plus,
  Edit,
  Star
} from 'lucide-react'

interface ProgressTrackerProps {
  roadmap: any
  roadmapId?: string
}

export default function ProgressTracker({ roadmap, roadmapId }: ProgressTrackerProps) {
  const [weeklyProgress, setWeeklyProgress] = useState([
    { week: 1, goal: 'Complete JavaScript basics course', completed: true, hours: 8 },
    { week: 2, goal: 'Build first React component', completed: true, hours: 12 },
    { week: 3, goal: 'Learn Node.js fundamentals', completed: false, hours: 6 },
    { week: 4, goal: 'Create full-stack mini project', completed: false, hours: 0 }
  ])

  const [currentWeek, setCurrentWeek] = useState(3)

  useEffect(() => {
    // Load progress from API if roadmapId is available
    if (roadmapId) {
      loadProgress()
    }
  }, [roadmapId])

  const loadProgress = async () => {
    try {
      const response = await fetch(`/api/progress?roadmapId=${roadmapId}&userId=demo-user-id`)
      const result = await response.json()
      
      if (result.success && result.progress.length > 0) {
        setWeeklyProgress(result.progress.map(p => ({
          week: p.weekNumber,
          goal: p.goal,
          completed: p.completed,
          hours: p.actualHours
        })))
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
    }
  }

  const updateProgress = async (weekNumber: number, updates: any) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'demo-user-id',
          roadmapId: roadmapId || 'demo-roadmap-id',
          weekNumber,
          ...updates
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setWeeklyProgress(prev => 
          prev.map(week => 
            week.week === weekNumber 
              ? { ...week, ...updates }
              : week
          )
        )
      }
    } catch (error) {
      console.error('Failed to update progress:', error)
      // Update local state anyway for demo
      setWeeklyProgress(prev => 
        prev.map(week => 
          week.week === weekNumber 
            ? { ...week, ...updates }
            : week
        )
      )
    }
  }

  const completedWeeks = weeklyProgress.filter(w => w.completed).length
  const totalHours = weeklyProgress.reduce((sum, week) => sum + week.hours, 0)
  const targetHours = 40 // Target hours per month

  const milestoneProgress = roadmap.milestones.map((milestone: any, index: number) => ({
    ...milestone,
    progress: index === 0 ? 100 : index === 1 ? 60 : 0,
    status: index === 0 ? 'completed' : index === 1 ? 'in-progress' : 'not-started'
  }))

  return (
    <div className="space-y-6">
      {/* Overall Progress Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold">45%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Weeks Active</p>
                <p className="text-2xl font-bold">{completedWeeks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Hours Learned</p>
                <p className="text-2xl font-bold">{totalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Milestones</p>
                <p className="text-2xl font-bold">1/3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Progress Tracking */}
      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly Progress</TabsTrigger>
          <TabsTrigger value="milestones">Milestone Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          {/* Current Week Focus */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Week {currentWeek} Focus
                  </CardTitle>
                  <CardDescription>
                    Keep track of your weekly learning goals and progress
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{weeklyProgress[currentWeek - 1]?.goal}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Target: 10 hours • Current: {weeklyProgress[currentWeek - 1]?.hours || 0} hours
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={weeklyProgress[currentWeek - 1]?.completed ? "default" : "secondary"}>
                      {weeklyProgress[currentWeek - 1]?.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Weekly Progress</span>
                    <span>{((weeklyProgress[currentWeek - 1]?.hours || 0) / 10) * 100}%</span>
                  </div>
                  <Progress value={((weeklyProgress[currentWeek - 1]?.hours || 0) / 10) * 100} className="h-2" />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      const newHours = (weeklyProgress[currentWeek - 1]?.hours || 0) + 2
                      updateProgress(currentWeek, { actualHours: newHours })
                    }}
                  >
                    Log 2 Hours
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => updateProgress(currentWeek, { completed: true })}
                  >
                    Mark Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Week by Week Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Week by Week Progress</CardTitle>
              <CardDescription>
                Your learning journey over the past weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyProgress.map((week) => (
                  <div key={week.week} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {week.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                      <div>
                        <h4 className="font-medium">Week {week.week}: {week.goal}</h4>
                        <p className="text-sm text-gray-600">{week.hours} hours completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={week.completed ? "default" : "secondary"}>
                        {week.completed ? "Completed" : week.hours > 0 ? "In Progress" : "Not Started"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add Next Week Goal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <div className="space-y-4">
            {milestoneProgress.map((milestone) => (
              <Card key={milestone.id} className={
                milestone.status === 'completed' ? 'border-green-200 bg-green-50' :
                milestone.status === 'in-progress' ? 'border-blue-200 bg-blue-50' :
                'border-gray-200'
              }>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      ) : milestone.status === 'in-progress' ? (
                        <Clock className="w-8 h-8 text-blue-500" />
                      ) : (
                        <Circle className="w-8 h-8 text-gray-400" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                        <CardDescription>{milestone.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        milestone.status === 'completed' ? "default" :
                        milestone.status === 'in-progress' ? "secondary" :
                        "outline"
                      }>
                        {milestone.status === 'completed' ? "Completed" :
                         milestone.status === 'in-progress' ? "In Progress" :
                         "Not Started"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {milestone.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Learning Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Learning Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Target</span>
                    <span className="text-sm">{targetHours} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Current Progress</span>
                    <span className="text-sm">{totalHours} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-sm">{((totalHours / targetHours) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(totalHours / targetHours) * 100} className="h-3" />
                  
                  <div className="pt-2">
                    <p className="text-xs text-gray-600">
                      {totalHours >= targetHours ? 
                        "Great job! You've met your monthly target!" :
                        `You need ${targetHours - totalHours} more hours to reach your monthly target`
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-xs font-medium">Fast Learner</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-xs font-medium">Goal Setter</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-xs font-medium">Consistent</p>
                  </div>
                  <div className="text-center opacity-50">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-xs font-medium">Master</p>
                  </div>
                  <div className="text-center opacity-50">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-xs font-medium">Expert</p>
                  </div>
                  <div className="text-center opacity-50">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-xs font-medium">Scholar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}