// Pure scoring function — takes an already-resolved list of required
// skills (usually generated dynamically by AI, see groq-skills.ts) and
// compares it against the user's extracted skills.
export function computeATSScore(
  userSkills: string[],
  requiredSkills: string[]
) {
  const matchedSkills = userSkills.filter((userSkill) =>
    requiredSkills.some(
      (requiredSkill) =>
        requiredSkill.toLowerCase().trim() === userSkill.toLowerCase().trim()
    )
  )

  const missingSkills = requiredSkills.filter(
    (requiredSkill) =>
      !userSkills.some(
        (userSkill) =>
          userSkill.toLowerCase().trim() === requiredSkill.toLowerCase().trim()
      )
  )

  const score =
    requiredSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / requiredSkills.length) * 100)

  return { score, matchedSkills, missingSkills }
}

// ── Fallback keyword map ──────────────────────────────────────────
// Used ONLY when the Groq call fails (missing key, rate limit, network
// error) so the app degrades gracefully instead of breaking entirely.
const GOAL_SKILL_GROUPS: { keywords: string[]; skills: string[] }[] = [
  {
    keywords: ["devops", "site reliability", "sre"],
    skills: [
      "Docker", "Kubernetes", "CI/CD", "Jenkins", "AWS", "Azure", "GCP",
      "Terraform", "Ansible", "Linux", "Git", "Bash", "Monitoring",
    ],
  },
  {
    keywords: ["data scientist", "data science", "machine learning", "ml engineer", "ai engineer", "ai/ml"],
    skills: [
      "Python", "Machine Learning", "Deep Learning", "TensorFlow",
      "PyTorch", "LLMs", "NLP", "SQL", "Data Structures", "Pandas",
    ],
  },
  {
    keywords: ["data analyst"],
    skills: ["SQL", "Python", "Excel", "Power BI", "Tableau", "Data Structures", "Statistics"],
  },
  {
    keywords: ["mobile", "android", "ios", "flutter", "react native"],
    skills: ["Java", "Kotlin", "Swift", "React Native", "Flutter", "REST API Design", "Git"],
  },
  {
    keywords: ["cloud"],
    skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Linux", "Networking"],
  },
  {
    keywords: ["cybersecurity", "security engineer", "penetration"],
    skills: ["Networking", "Linux", "Python", "Cryptography", "OWASP", "Cloud Security"],
  },
  {
    keywords: ["qa", "test engineer", "sdet"],
    skills: ["Selenium", "Java", "Python", "API Integration", "Test Automation", "Git"],
  },
  {
    keywords: ["ui/ux", "ux designer", "ui designer", "product designer"],
    skills: ["Figma", "Wireframing", "User Research", "Prototyping", "HTML", "CSS"],
  },
  {
    keywords: ["full stack", "fullstack"],
    skills: [
      "HTML", "CSS", "JavaScript", "React", "Next.js", "Node.js",
      "MongoDB", "SQL", "REST API Design", "Git",
    ],
  },
  {
    keywords: ["backend"],
    skills: ["Node.js", "Express.js", "MongoDB", "SQL", "REST API Design", "Java", "Spring Boot", "Git"],
  },
  {
    keywords: ["frontend", "front-end", "front end"],
    skills: ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "Git"],
  },
]

const GENERIC_FALLBACK_SKILLS = [
  "Git", "Problem Solving", "Data Structures", "Algorithms", "SQL",
  "REST API Design", "Debugging",
]

export function getFallbackRequiredSkills(careerGoal: string): string[] {
  const goalLower = careerGoal.trim().toLowerCase()
  if (!goalLower) return GENERIC_FALLBACK_SKILLS

  for (const group of GOAL_SKILL_GROUPS) {
    if (group.keywords.some((kw) => goalLower.includes(kw))) {
      return group.skills
    }
  }
  return GENERIC_FALLBACK_SKILLS
}
