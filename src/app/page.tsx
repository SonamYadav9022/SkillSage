'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Target, Calendar, BookOpen, TrendingUp, MessageCircle, CheckCircle, Clock, Star } from 'lucide-react'
import ResumeUpload from '@/components/ResumeUpload'
import GoalSetting from '@/components/GoalSetting'
import RoadmapDisplay from '@/components/RoadmapDisplay'
import ProgressTracker from '@/components/ProgressTracker'
import AICompanion from '@/components/AICompanion'

// ------------------------------------------------------------------
// 1. INTERFACE DEFINITIONS (The primary fix for TypeScript errors)
// ------------------------------------------------------------------

// A basic type definition for the complex Roadmap object
interface Roadmap {
  title: string;
  duration: string;
  milestones: any[];
  recommendations: any;
  id?: string; // Add optional id property here for generation
}

// Define the shape of the UserData state object
interface UserDataState {
  resume: any;
  goal: string;
  duration: string;
  currentSkills: string[];
  roadmap: Roadmap | null;
  progress: {};
  // Properties used in update functions, must be included here:
  userId: string | null;
  roadmapId: string | null;
  experience: string | null;
  education: string | null;
}

// Define the expected structure for resumeData from the component
interface ResumeData {
  resume: File | null;
  manualSkills: string[];
  currentSkills?: string[];
  experience?: string;
  education?: string;
}

// ------------------------------------------------------------------

export default function Home() {
  const [activeTab, setActiveTab] = useState('upload')
  
  // 2. Initial State Fix: Applied UserDataState interface and included missing properties
  const [userData, setUserData] = useState<UserDataState>({
    resume: null,
    goal: '',
    duration: '',
    currentSkills: [],
    roadmap: null,
    progress: {},
    userId: null,
    roadmapId: null,
    experience: null,
    education: null
  })

  // 3. Function Parameter Type Fix: Applied ResumeData interface
  const handleResumeUpload = async (resumeData: ResumeData) => {
    try {
      const formData = new FormData()
      
      if (resumeData.resume) {
        formData.append('resume', resumeData.resume)
      }
      if (resumeData.manualSkills) {
        formData.append('manualSkills', resumeData.manualSkills.join(','))
      }
      formData.append('userId', userData.userId || 'temp-user-id') // Use existing userId if available

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        setUserData(prev => ({ 
          ...prev, 
          userId: result.userId,
          currentSkills: result.currentSkills,
          experience: result.experience,
          education: result.education
        }))
        setActiveTab('goal')
      } else {
        console.error('Resume upload failed:', result.error)
        // Fallback to mock data for demo
        setUserData(prev => ({ 
          ...prev, 
          userId: 'demo-user-id',
          currentSkills: resumeData.currentSkills || ['JavaScript', 'React', 'Node.js'],
          experience: resumeData.experience || 'College Student',
          education: resumeData.education || 'Computer Science'
        }))
        setActiveTab('goal')
      }
    } catch (error) {
      console.error('Resume upload error:', error)
      // Fallback to mock data for demo
      setUserData(prev => ({ 
        ...prev, 
        userId: 'demo-user-id',
        currentSkills: resumeData.currentSkills || ['JavaScript', 'React', 'Node.js'],
        experience: resumeData.experience || 'College Student',
        education: resumeData.education || 'Computer Science'
      }))
      setActiveTab('goal')
    }
  }

  const handleGoalSet = async (goalData) => {
    setUserData(prev => ({ ...prev, ...goalData }))
    await generateRoadmap(goalData.goal, goalData.duration)
  }

  const generateRoadmap = async (goal, duration) => {
    try {
      const response = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userData.userId || 'demo-user-id',
          goal,
          duration,
          currentSkills: userData.currentSkills || []
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setUserData(prev => ({ 
          ...prev, 
          roadmap: result.roadmap,
          roadmapId: result.roadmap.id
        }))
        setActiveTab('roadmap')
      } else {
        console.error('Roadmap generation failed:', result.error)
        // Fallback to mock roadmap
        generateMockRoadmap(goal, duration)
      }
    } catch (error) {
      console.error('Roadmap generation error:', error)
      // Fallback to mock roadmap
      generateMockRoadmap(goal, duration)
    }
  }

  const generateMockRoadmap = (goal, duration) => {
    const mockRoadmap: Roadmap = { // Applied Roadmap interface here too
      title: `Career Path: ${goal}`,
      duration: duration,
      milestones: [
        {
          id: 1,
          title: "Foundation Building",
          description: "Establish core fundamentals and prerequisites",
          duration: "4 weeks",
          skills: ["JavaScript Basics", "HTML/CSS", "Version Control"],
          courses: [
            { title: "Complete Web Development Bootcamp", provider: "Udemy", rating: 4.7, duration: "8 weeks" },
            { title: "JavaScript: The Complete Guide", provider: "Udemy", rating: 4.6, duration: "6 weeks" }
          ],
          resources: ["FreeCodeCamp", "MDN Web Docs", "GitHub Projects"],
          completed: false
        },
        {
          id: 2,
          title: "Skill Development",
          description: "Build intermediate to advanced skills",
          duration: "8 weeks",
          skills: ["React.js", "Node.js", "Database Management"],
          courses: [
            { title: "React - The Complete Guide", provider: "Udemy", rating: 4.8, duration: "10 weeks" },
            { title: "Node.js Advanced Concepts", provider: "Coursera", rating: 4.5, duration: "6 weeks" }
          ],
          resources: ["React Documentation", "Node.js Best Practices", "Stack Overflow"],
          completed: false
        },
        {
          id: 3,
          title: "Practical Application",
          description: "Apply skills through real-world projects",
          duration: "6 weeks",
          skills: ["Full-stack Projects", "API Development", "Testing"],
          courses: [
            { title: "Build 50 Projects", provider: "YouTube", rating: 4.9, duration: "12 weeks" },
            { title: "Testing & Debugging Masterclass", provider: "Pluralsight", rating: 4.4, duration: "4 weeks" }
          ],
          resources: ["GitHub", "CodePen", "Dev.to"],
          completed: false
        }
      ],
      recommendations: {
        tips: [
          "Practice coding daily, even if it's just for 30 minutes",
          "Join online communities and participate in discussions",
          "Build a portfolio of projects to showcase your skills",
          "Network with professionals in your target field"
        ],
        advice: [
          "Focus on understanding concepts rather than memorizing syntax",
          "Don't be afraid to ask for help when stuck",
          "Stay updated with industry trends and technologies",
          "Develop soft skills alongside technical skills"
        ]
      },
      id: 'demo-roadmap-id' // Added id here for consistency
    }
    
    setUserData(prev => ({ 
      ...prev, 
      roadmap: mockRoadmap,
      roadmapId: 'demo-roadmap-id'
    }))
    setActiveTab('roadmap')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SkillSage</h1>
              <Badge variant="secondary" className="ml-2">AI-Powered</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Guide
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your AI-Powered Career Roadmap Generator
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get personalized career guidance tailored to your skills and goals. 
            Upload your resume, set your career objectives, and let AI create your path to success.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${activeTab === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
                <Upload className="w-5 h-5" />
                <span className="font-medium">Upload Resume</span>
              </div>
              <div className={`flex items-center space-x-2 ${activeTab === 'goal' ? 'text-blue-600' : 'text-gray-400'}`}>
                <Target className="w-5 h-5" />
                <span className="font-medium">Set Goal</span>
              </div>
              <div className={`flex items-center space-x-2 ${activeTab === 'roadmap' ? 'text-blue-600' : 'text-gray-400'}`}>
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">View Roadmap</span>
              </div>
              <div className={`flex items-center space-x-2 ${activeTab === 'progress' ? 'text-blue-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Track Progress</span>
              </div>
            </div>
          </div>
          <Progress value={activeTab === 'upload' ? 25 : activeTab === 'goal' ? 50 : activeTab === 'roadmap' ? 75 : 100} className="h-2" />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            <TabsTrigger value="goal" disabled={!userData.resume}>Set Goal</TabsTrigger>
            <TabsTrigger value="roadmap" disabled={!userData.roadmap}>Your Roadmap</TabsTrigger>
            <TabsTrigger value="progress" disabled={!userData.roadmap}>Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <ResumeUpload onUpload={handleResumeUpload} />
          </TabsContent>

          <TabsContent value="goal" className="space-y-6">
            <GoalSetting onGoalSet={handleGoalSet} currentSkills={userData.currentSkills} />
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            {userData.roadmap && <RoadmapDisplay roadmap={userData.roadmap} />}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
          {/* The Fix: Check for both the roadmap object AND the roadmapId */}
          {userData.roadmap && userData.roadmapId && (
          <ProgressTracker roadmap={userData.roadmap} roadmapId={userData.roadmapId} />
          )}
</TabsContent>
        </Tabs>
      </main>

      {/* AI Companion - Fixed Position */}
      {userData.roadmap && (
        <div className="fixed bottom-4 right-4 z-50">
          <AICompanion />
        </div>
      )}
    </div>
  )
}