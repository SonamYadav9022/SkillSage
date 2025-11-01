'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Target, Calendar, Clock, TrendingUp, Users, Code, Palette, Briefcase, Heart } from 'lucide-react'

interface GoalSettingProps {
  onGoalSet: (data: any) => void
  currentSkills: string[]
}

const careerGoals = [
  { 
    title: 'Full Stack Developer', 
    icon: Code,
    description: 'Build end-to-end web applications',
    skills: ['React', 'Node.js', 'Database', 'API Design'],
    demand: 'High'
  },
  { 
    title: 'Frontend Developer', 
    icon: Palette,
    description: 'Create beautiful user interfaces',
    skills: ['React', 'CSS', 'UX/UI', 'TypeScript'],
    demand: 'High'
  },
  { 
    title: 'Backend Developer', 
    icon: Code,
    description: 'Design server-side architecture',
    skills: ['Node.js', 'Python', 'Database', 'Cloud'],
    demand: 'High'
  },
  { 
    title: 'Product Manager', 
    icon: Briefcase,
    description: 'Lead product strategy and development',
    skills: ['Strategy', 'Analytics', 'Communication', 'Leadership'],
    demand: 'Medium'
  },
  { 
    title: 'UX Designer', 
    icon: Palette,
    description: 'Design user-centered experiences',
    skills: ['Design Tools', 'User Research', 'Prototyping', 'Psychology'],
    demand: 'Medium'
  },
  { 
    title: 'Data Scientist', 
    icon: TrendingUp,
    description: 'Analyze complex data and build ML models',
    skills: ['Python', 'Statistics', 'Machine Learning', 'SQL'],
    demand: 'Very High'
  }
]

const durationOptions = [
  { label: '3 Months', value: '3 months', description: 'Intensive learning path' },
  { label: '6 Months', value: '6 months', description: 'Balanced approach' },
  { label: '1 Year', value: '1 year', description: 'Comprehensive learning' },
  { label: '2 Years', value: '2 years', description: 'Mastery-focused path' }
]

export default function GoalSetting({ onGoalSet, currentSkills }: GoalSettingProps) {
  const [selectedGoal, setSelectedGoal] = useState('')
  const [customGoal, setCustomGoal] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('')
  const [step, setStep] = useState(1)

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal)
    setStep(2)
  }

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration)
    setStep(3)
  }

  const handleSubmit = () => {
    const finalGoal = selectedGoal || customGoal
    onGoalSet({
      goal: finalGoal,
      duration: selectedDuration
    })
  }

  const getSkillGap = (requiredSkills: string[]) => {
    return requiredSkills.filter(skill => !currentSkills.includes(skill))
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="font-medium">Choose Goal</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="font-medium">Set Duration</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span className="font-medium">Generate Roadmap</span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                What's Your Career Goal?
              </CardTitle>
              <CardDescription>
                Select from popular career paths or define your own custom goal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {careerGoals.map((career) => {
                  const Icon = career.icon
                  const skillGap = getSkillGap(career.skills)
                  
                  return (
                    <Card 
                      key={career.title}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedGoal === career.title ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleGoalSelect(career.title)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Icon className="w-8 h-8 text-blue-600" />
                          <Badge variant={career.demand === 'Very High' ? 'destructive' : career.demand === 'High' ? 'default' : 'secondary'}>
                            {career.demand} Demand
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-2">{career.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{career.description}</p>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-700">Key Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {career.skills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          {skillGap.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-orange-600">
                                {skillGap.length} skill{skillGap.length > 1 ? 's' : ''} to develop
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Or define your own goal:</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Become a Machine Learning Engineer"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                  />
                  <Button 
                    onClick={() => handleGoalSelect(customGoal)}
                    disabled={!customGoal.trim()}
                  >
                    Use Custom Goal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              What's Your Timeline?
            </CardTitle>
            <CardDescription>
              Choose how long you want to take to reach your goal: {selectedGoal || customGoal}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {durationOptions.map((option) => (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedDuration === option.value ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleDurationSelect(option.value)}
                >
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold mb-1">{option.label}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back to Goals
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Ready to Generate Your Roadmap!
            </CardTitle>
            <CardDescription>
              Review your choices and generate your personalized career roadmap
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Career Goal</p>
                  <p className="text-lg font-semibold">{selectedGoal || customGoal}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Timeline</p>
                  <p className="text-lg font-semibold">{selectedDuration}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                Generate My Roadmap
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}