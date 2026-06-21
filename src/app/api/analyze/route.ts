import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

interface AnalysisResponse {
  current_role: string;
  identified_skills: string[];
  soft_skills: string[];
  next_role_recommendation: string;
  skill_gaps: string[];
  learning_path: string[];
  timeline_months: number;
  key_milestones: string[];
  career_path_justification: string;
  gap_analysis: string;
  recommended_courses: Array<{
    title: string;
    skill: string;
    provider: string;
    duration: string;
    level: string;
    rating: string;
    price: string;
    link: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { resumeText, interests } = await request.json();

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: `You are an expert career advisor. Analyze this resume and career interests to create a personalized career roadmap.

Resume:
${resumeText}

Career Interests:
${interests || "Not specified"}

Provide a detailed JSON response ONLY (no markdown, no explanation) with this exact structure:
{
  "current_role": "identified job title/role",
  "identified_skills": ["skill1", "skill2", ...],
  "soft_skills": ["leadership", "communication", ...],
  "next_role_recommendation": "recommended next career role",
  "skill_gaps": ["gap1", "gap2", ...],
  "learning_path": ["step1", "step2", "step3", ...],
  "timeline_months": 6-12,
  "key_milestones": ["milestone1", "milestone2", "milestone3"],
  "career_path_justification": "detailed explanation of why this path fits",
  "gap_analysis": "analysis of what skills are needed and why",
  "recommended_courses": [
    {
      "title": "course name",
      "skill": "primary skill taught",
      "provider": "platform name",
      "duration": "estimated time",
      "level": "beginner/intermediate/advanced",
      "rating": "4.5/5",
      "price": "free/paid",
      "link": "https://example.com"
    }
  ]
}

Focus on:
1. Current role that best matches the resume
2. All technical and soft skills detected
3. Based on interests and current skills, suggest the most logical next role
4. Identify specific skill gaps for the recommended role
5. Create a practical 4-6 step learning path
6. Suggest real, credible courses for each gap skill
7. Be specific with timeline estimates

Return ONLY valid JSON, no other text.`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Clean up response if it has markdown formatting
    const cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const analysis: AnalysisResponse = JSON.parse(cleanedText);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to analyze resume",
      },
      { status: 500 }
    );
  }
}
