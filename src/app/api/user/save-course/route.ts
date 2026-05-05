import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session =
      await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const newCourse =
      body.selectedCourse?.trim() || ""

    const goal =
      body.goal?.trim() || ""

    const user =
      await db.user.findUnique({
        where: {
          email: session.user.email,
        },
      })

    const oldCourses =
      user?.selectedCourse
        ? user.selectedCourse
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean)
        : []

    let updatedCourses =
      [...oldCourses]

    if (
      newCourse &&
      !oldCourses.includes(newCourse)
    ) {
      updatedCourses.push(newCourse)
    }

    await db.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        selectedCourse:
          updatedCourses.join(','),
        goal,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed" },
      { status: 500 }
    )
  }
}