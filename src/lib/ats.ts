// ── Skill name normalization ──────────────────────────────────────
// The resume-extraction AI call and the required-skills AI call are
// two independent generations, so they can word the same skill
// differently ("GitHub" vs "Git", "JS" vs "JavaScript", "Node" vs
// "Node.js"). Exact string matching after that causes false "missing
// skill" results even when the user clearly has the skill. This map
// normalizes common variants to one canonical form before comparing.
const SKILL_ALIASES: Record<string, string> = {
  git: "git", github: "git", gitlab: "git", "version control": "git",

  js: "javascript", javascript: "javascript", "es6": "javascript",
  ts: "typescript", typescript: "typescript",

  node: "nodejs", "node.js": "nodejs", nodejs: "nodejs",
  react: "react", "react.js": "react", reactjs: "react",
  next: "nextjs", "next.js": "nextjs", nextjs: "nextjs",
  vue: "vuejs", "vue.js": "vuejs", vuejs: "vuejs",
  angular: "angular", angularjs: "angular",

  postgres: "postgresql", postgresql: "postgresql", psql: "postgresql",
  mongo: "mongodb", mongodb: "mongodb",
  mysql: "mysql",

  py: "python", python: "python",
  "c sharp": "csharp", "c#": "csharp", csharp: "csharp",
  "c plus plus": "cpp", "c++": "cpp", cpp: "cpp",

  aws: "aws", "amazon web services": "aws",
  gcp: "gcp", "google cloud": "gcp", "google cloud platform": "gcp",
  azure: "azure", "microsoft azure": "azure",

  docker: "docker", kubernetes: "kubernetes", k8s: "kubernetes",
  "ci/cd": "cicd", cicd: "cicd", "ci cd": "cicd",

  "rest api": "restapi", "rest apis": "restapi", "restful api": "restapi",
  "rest api design": "restapi", api: "restapi",

  "spring boot": "springboot", springboot: "springboot", spring: "springboot",

  html: "html", "html5": "html",
  css: "css", "css3": "css",

  sql: "sql",
  "machine learning": "ml", ml: "ml",
  "deep learning": "dl", dl: "dl",
  nlp: "nlp", "natural language processing": "nlp",

  linux: "linux", unix: "linux", bash: "bash", shell: "bash",
}

function normalizeSkill(raw: string): string {
  const cleaned = raw.toLowerCase().trim()
  return SKILL_ALIASES[cleaned] ?? cleaned
}

// Two skill names are considered the same if, after normalization,
// they're identical OR one contains the other as a whole word (catches
// cases like "React" vs "React Native" being treated as distinct,
// while "Docker" vs "Docker Compose" still correctly matches "Docker").
function skillsMatch(a: string, b: string): boolean {
  const na = normalizeSkill(a)
  const nb = normalizeSkill(b)
  if (na === nb) return true
  if (na.length >= 3 && nb.length >= 3) {
    if (na.includes(nb) || nb.includes(na)) return true
  }
  return false
}

// Pure scoring function — takes an already-resolved list of required
// skills (usually generated dynamically by AI, see groq-skills.ts) and
// compares it against the user's extracted skills.
export function computeATSScore(
  userSkills: string[],
  requiredSkills: string[]
) {
  const matchedSkills = userSkills.filter((userSkill) =>
    requiredSkills.some((requiredSkill) => skillsMatch(userSkill, requiredSkill))
  )

  const missingSkills = requiredSkills.filter(
    (requiredSkill) =>
      !userSkills.some((userSkill) => skillsMatch(userSkill, requiredSkill))
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
