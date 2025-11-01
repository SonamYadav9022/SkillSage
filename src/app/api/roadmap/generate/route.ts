import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { userId, goal, duration, currentSkills } = await request.json()

    if (!userId || !goal || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate roadmap using AI
    let roadmapData
    try {
      const zai = await ZAI.create()
      
      const prompt = `Generate a comprehensive career roadmap for a college student who wants to become a ${goal} in ${duration}. 
      
      Current skills: ${currentSkills.join(', ')}
      
      Create a detailed roadmap with:
      1. 3-4 major milestones with titles and descriptions
      2. For each milestone, include:
         - Specific skills to learn
         - Recommended courses with providers, ratings, and durations
         - Additional learning resources
         - Estimated time to complete
      3. Overall recommendations including tips and career advice
      
      Return as a JSON object with this structure:
      {
        "title": "Career Path: ${goal}",
        "duration": "${duration}",
        "milestones": [
          {
            "id": 1,
            "title": "Milestone Title",
            "description": "Description",
            "duration": "X weeks",
            "skills": ["skill1", "skill2"],
            "courses": [
              {"title": "Course Name", "provider": "Provider", "rating": 4.5, "duration": "X weeks"}
            ],
            "resources": ["Resource1", "Resource2"]
          }
        ],
        "recommendations": {
          "tips": ["tip1", "tip2"],
          "advice": ["advice1", "advice2"]
        }
      }`

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a career guidance expert. Generate detailed, actionable career roadmaps. Return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      })

      const roadmapText = completion.choices[0]?.message?.content
      if (roadmapText) {
        roadmapData = JSON.parse(roadmapText)
      }
    } catch (error) {
      console.error('AI roadmap generation failed:', error)
      // Fallback to mock roadmap
      roadmapData = {
        title: `Career Path: ${goal}`,
        duration: duration,
        milestones: [
          {
            id: 1,
            title: "Foundation Building",
            description: "Establish core fundamentals and prerequisites",
            duration: "4 weeks",
            skills: currentSkills.slice(0, 3),
            courses: [
              { title: "Complete Web Development Bootcamp", provider: "Udemy", rating: 4.7, duration: "8 weeks" },
              { title: "JavaScript: The Complete Guide", provider: "Udemy", rating: 4.6, duration: "6 weeks" }
            ],
            resources: ["FreeCodeCamp", "MDN Web Docs", "GitHub Projects"]
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
            resources: ["React Documentation", "Node.js Best Practices", "Stack Overflow"]
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
            resources: ["GitHub", "CodePen", "Dev.to"]
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
        }
      }
    }

    // Save roadmap to database
    const roadmap = await db.roadmap.create({
      data: {
        userId,
        title: roadmapData.title,
        goal,
        duration,
        status: 'active',
        milestones: roadmapData.milestones,
        recommendations: roadmapData.recommendations
      }
    })

    // Initialize weekly progress
    const totalWeeks = Math.ceil(parseInt(duration) * 4) // Rough estimate
    for (let week = 1; week <= Math.min(totalWeeks, 4); week++) {
      await db.progress.create({
        data: {
          userId,
          roadmapId: roadmap.id,
          weekNumber: week,
          goal: `Week ${week}: Focus on ${roadmapData.milestones[0]?.skills[0] || 'fundamentals'}`,
          targetHours: 10,
          actualHours: 0,
          completed: false
        }
      })
    }

    return NextResponse.json({
      success: true,
      roadmap: {
        id: roadmap.id,
        ...roadmapData
      }
    })

  } catch (error) {
    console.error('Roadmap generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    )
  }
}