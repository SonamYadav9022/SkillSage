import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('resume') as File
    const userId = formData.get('userId') as string
    const manualSkills = formData.get('manualSkills') as string

    if (!file && !manualSkills) {
      return NextResponse.json({ error: 'No file or manual skills provided' }, { status: 400 })
    }

    let extractedSkills: string[] = []

    if (file) {
      // Process uploaded file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Here you would typically parse the PDF/DOC file
      // For now, we'll use AI to extract skills from the filename and simulate parsing
      try {
        const zai = await ZAI.create()
        
        const prompt = `Extract technical and professional skills from this resume filename: ${file.name}. 
        Also suggest common skills for a college student resume. Return as a JSON array of skill strings.`
        
        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a resume parsing assistant. Extract skills and return them as a JSON array.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
        })

        const skillsText = completion.choices[0]?.message?.content || '[]'
        extractedSkills = JSON.parse(skillsText)
      } catch (error) {
        console.error('AI parsing failed:', error)
        // Fallback to mock skills
        extractedSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Git', 'Communication']
      }
    } else if (manualSkills) {
      extractedSkills = manualSkills.split(',').map(s => s.trim()).filter(s => s)
    }

    // Create or update user
    let user = await db.user.findFirst({
      where: { email: `user_${Date.now()}@example.com` } // Temporary email handling
    })

    if (!user) {
      user = await db.user.create({
        data: {
          email: `user_${Date.now()}@example.com`,
          name: 'Student User',
          experience: 'College Student',
          education: 'Computer Science'
        }
      })
    }

    // Store skills in database
    for (const skillName of extractedSkills) {
      let skill = await db.skill.findFirst({
        where: { name: skillName }
      })

      if (!skill) {
        skill = await db.skill.create({
          data: {
            name: skillName,
            category: 'technical',
            description: `Skill in ${skillName}`
          }
        })
      }

      // Link skill to user
      await db.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: skill.id
          }
        },
        update: {
          level: 'intermediate'
        },
        create: {
          userId: user.id,
          skillId: skill.id,
          level: 'intermediate'
        }
      })
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      currentSkills: extractedSkills,
      experience: user.experience,
      education: user.education
    })

  } catch (error) {
    console.error('Resume upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    )
  }
}