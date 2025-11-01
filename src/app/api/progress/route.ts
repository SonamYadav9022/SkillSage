import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET progress for a user/roadmap
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const roadmapId = searchParams.get('roadmapId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const progress = await db.progress.findMany({
      where: {
        userId,
        ...(roadmapId && { roadmapId })
      },
      orderBy: {
        weekNumber: 'asc'
      }
    })

    return NextResponse.json({ success: true, progress })

  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

// POST update progress
export async function POST(request: NextRequest) {
  try {
    const { userId, roadmapId, weekNumber, actualHours, completed, notes } = await request.json()

    if (!userId || !roadmapId || !weekNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const progress = await db.progress.upsert({
      where: {
        userId_roadmapId_weekNumber: {
          userId,
          roadmapId,
          weekNumber
        }
      },
      update: {
        actualHours: actualHours || 0,
        completed: completed || false,
        notes: notes || ''
      },
      create: {
        userId,
        roadmapId,
        weekNumber,
        goal: `Week ${weekNumber}: Learning Goal`,
        targetHours: 10,
        actualHours: actualHours || 0,
        completed: completed || false,
        notes: notes || ''
      }
    })

    return NextResponse.json({ success: true, progress })

  } catch (error) {
    console.error('Progress update error:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}