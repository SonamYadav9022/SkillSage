import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const zai = await ZAI.create()
    
    // Build context-aware prompt
    const contextInfo = context ? `
      User Context:
      - Current Goal: ${context.goal || 'Not set'}
      - Current Skills: ${context.currentSkills?.join(', ') || 'Not assessed'}
      - Progress: ${context.progress || 'Just starting'}
      - Current Week: ${context.currentWeek || '1'}
    ` : ''

    const systemPrompt = `You are an AI career companion and mentor for college students learning tech skills. You are:
    - Encouraging and motivational
    - Knowledgeable about tech careers and learning paths
    - Practical and actionable in your advice
    - Able to break down complex topics into simple steps
    - Supportive when students face challenges
    
    ${contextInfo}
    
    Guidelines:
    - Keep responses conversational and friendly
    - Provide specific, actionable advice
    - Include relevant emojis for engagement
    - Ask follow-up questions to encourage dialogue
    - Be encouraging but realistic
    - Focus on progress over perfection
    
    Categories for responses:
    - "guidance": General advice and direction
    - "motivation": Encouragement and mindset support
    - "resource": Learning materials and tools
    - "advice": Career and skill development tips
    
    Return your response as a JSON object:
    {
      "content": "Your response text",
      "category": "guidance|motivation|resource|advice"
    }`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.8,
    })

    const responseText = completion.choices[0]?.message?.content || ''
    
    let response
    try {
      response = JSON.parse(responseText)
    } catch (error) {
      // Fallback if JSON parsing fails
      response = {
        content: responseText,
        category: 'guidance'
      }
    }

    return NextResponse.json({
      success: true,
      response
    })

  } catch (error) {
    console.error('AI chat error:', error)
    
    // Fallback response
    const fallbackResponses = [
      {
        content: "I'm here to help you on your learning journey! Could you tell me more about what you're working on right now?",
        category: "guidance"
      },
      {
        content: "Every expert was once a beginner! You're doing great by taking this step. What specific challenge can I help you with today?",
        category: "motivation"
      },
      {
        content: "Learning new skills takes time and patience. Remember to celebrate small wins along the way! What would you like to focus on?",
        category: "motivation"
      }
    ]
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    
    return NextResponse.json({
      success: true,
      response: randomResponse
    })
  }
}