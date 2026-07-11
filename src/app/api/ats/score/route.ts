import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeATSScore } from "@/lib/ats";
import { getRequiredSkillsForGoal } from "@/lib/groq-skills";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const skills: string[] = Array.isArray(body.skills) ? body.skills : [];
    const careerGoal: string = body.careerGoal ?? "";

    if (!careerGoal.trim()) {
      return NextResponse.json(
        { error: "careerGoal is required" },
        { status: 400 }
      );
    }

    const requiredSkills = await getRequiredSkillsForGoal(careerGoal);
    const ats = computeATSScore(skills, requiredSkills);

    // Persist so the score is remembered next time the dashboard loads
    await db.user.update({
      where: { email: session.user.email },
      data: { atsData: ats },
    });

    return NextResponse.json({ ...ats, requiredSkills });
  } catch (error: any) {
    console.error("[ATS Score]", error);
    return NextResponse.json(
      { error: "Failed to compute ATS score", detail: error.message },
      { status: 500 }
    );
  }
}
