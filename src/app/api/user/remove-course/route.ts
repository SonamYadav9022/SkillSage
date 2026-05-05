import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session =
    await getServerSession(authOptions)

  const body =
    await req.json()

  await db.user.update({
    where: {
      email: session?.user?.email!,
    },
    data: {
      selectedCourse:
        body.selectedCourse,
    },
  })

  return NextResponse.json({
    success: true,
  })
}