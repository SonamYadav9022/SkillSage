import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

interface ChatRequest {
  question: string;
  context?: {
    current_role?: string;
    next_role?: string;
    skill_gaps?: string[];
    identified_skills?: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const { question, context } = (await request.json()) as ChatRequest;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const contextInfo = context
      ? `
Context from user's career analysis:
- Current Role: ${context.current_role || "Not specified"}
- Target Role: ${context.next_role || "Not specified"}
- Current Skills: ${context.identified_skills?.join(", ") || "Not specified"}
- Skill Gaps: ${context.skill_gaps?.join(", ") || "Not specified"}
`
      : "";

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `You are an expert AI Career Advisor for SkillSage. Answer career-related questions with practical, actionable advice.

${contextInfo}

User Question: ${question}

Provide a helpful, concise response (2-3 paragraphs max) with:
1. Direct answer to their question
2. Actionable steps or recommendations
3. Resources or tips when relevant

Be encouraging, specific, and practical. If relevant, reference their career context.`,
        },
      ],
    });

    const response =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process chat",
      },
      { status: 500 }
    );
  }
}
