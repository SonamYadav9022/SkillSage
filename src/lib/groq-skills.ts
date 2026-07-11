import { getFallbackRequiredSkills } from "@/lib/ats";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// In-memory cache so repeated requests for the same career goal
// (very common — many users pick the same handful of goals) don't
// re-hit the Groq API every time. Cleared on cold start, which is
// fine — it's a performance optimization, not a correctness one.
const requiredSkillsCache = new Map<string, string[]>();

/**
 * Asks Groq to generate the essential technical skills for ANY career
 * goal the user types (not limited to a fixed list). Falls back to a
 * static keyword-based guess if the API key is missing or the call
 * fails for any reason, so ATS scoring never breaks.
 */
export async function getRequiredSkillsForGoal(
  careerGoal: string
): Promise<string[]> {
  const goal = careerGoal?.trim();
  if (!goal) return getFallbackRequiredSkills("");

  const cacheKey = goal.toLowerCase();
  const cached = requiredSkillsCache.get(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return getFallbackRequiredSkills(goal);

  const prompt = `You are an expert technical recruiter.
List the 8 to 10 most essential technical skills, tools, and technologies required for this career goal: "${goal}"

Respond ONLY with a valid JSON array of skill name strings, no markdown fences, no explanation, no extra keys.
Example format: ["Skill One", "Skill Two", "Skill Three"]

Rules:
- Use standard, well-known names for each skill (e.g. "React", "Docker", "SQL")
- Order from most to least essential
- Only include technical/hard skills, not soft skills`;

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 400,
      }),
    });

    if (!res.ok) {
      console.error("[groq-skills] Groq API error:", res.status, await res.text());
      return getFallbackRequiredSkills(goal);
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    const clean = raw.replace(/```json\n?|```/g, "").trim();
    const parsed = JSON.parse(clean);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return getFallbackRequiredSkills(goal);
    }

    const skills: string[] = parsed.filter((s: unknown) => typeof s === "string");
    requiredSkillsCache.set(cacheKey, skills);
    return skills;
  } catch (err) {
    console.error("[groq-skills] Failed to get skills for goal:", goal, err);
    return getFallbackRequiredSkills(goal);
  }
}
