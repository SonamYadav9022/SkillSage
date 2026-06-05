import { NextRequest, NextResponse } from 'next/server'

function generateRoadmap(
  goal: string,
  timeline: string
) {

  const lowerGoal =
    goal.toLowerCase()

  const isFast =
    timeline.includes('3')

  const isMedium =
    timeline.includes('6')

  const isLong =
    timeline.includes('1')

  // JAVA FULLSTACK

  if (
    lowerGoal.includes('java') ||
    lowerGoal.includes('full')
  ) {

    return {

      title:
        'Java Full Stack Developer',

      timeline,

      salaryRange:
        '₹6L - ₹25L',

      jobRoles: [
        'Java Developer',
        'Backend Developer',
        'Full Stack Engineer',
      ],

      phases: [

        {
          phase:
            'Foundation',

          duration:
            isFast
              ? '2 Weeks'
              : '1 Month',

          skills: [
            'Java Basics',
            'OOP',
            'HTML',
            'CSS',
            'JavaScript',
            'Git',
          ],

          tools: [
            'VS Code',
            'GitHub',
            'IntelliJ',
          ],

          projects: [
            'Portfolio Website',
            'Student Management System',
          ],

          resources: [
            'Apna College',
            'MDN Docs',
            'JavaTPoint',
          ],

          interviewPrep: [
            'Java OOP',
            'Collections',
            'Basic DSA',
          ],

          certifications: [
            'Java Foundations',
          ],
        },

        {
          phase:
            'Backend Engineering',

          duration:
            isFast
              ? '1 Month'
              : '2 Months',

          skills: [
            'Spring Boot',
            'REST APIs',
            'JWT Auth',
            'MySQL',
          ],

          tools: [
            'Postman',
            'MySQL Workbench',
            'Render',
          ],

          projects: [
            'Authentication System',
            'E-commerce Backend',
          ],

          resources: [
            'Spring Docs',
            'Baeldung',
          ],

          interviewPrep: [
            'DBMS',
            'OS',
            'API Questions',
          ],

          certifications: [
            'Spring Boot',
          ],
        },

        ...(isLong
          ? [
              {
                phase:
                  'Advanced Engineering',

                duration:
                  '4 Months',

                skills: [
                  'Docker',
                  'AWS',
                  'CI/CD',
                  'System Design',
                ],

                tools: [
                  'Docker',
                  'AWS',
                  'GitHub Actions',
                ],

                projects: [
                  'Production SaaS App',
                ],

                resources: [
                  'AWS Docs',
                  'System Design Primer',
                ],

                interviewPrep: [
                  'LLD',
                  'HLD',
                  'Advanced DSA',
                ],

                certifications: [
                  'AWS Cloud Practitioner',
                ],
              },
            ]
          : []),
      ],
    }
  }

  // AI ENGINEER

  if (
    lowerGoal.includes('ai')
  ) {

    return {

      title:
        'AI Engineer',

      timeline,

      salaryRange:
        '₹10L - ₹40L',

      jobRoles: [
        'AI Engineer',
        'ML Engineer',
        'LLM Engineer',
      ],

      phases: [

        {
          phase:
            'Python & Data',

          duration:
            '1 Month',

          skills: [
            'Python',
            'NumPy',
            'Pandas',
            'Statistics',
          ],

          tools: [
            'VS Code',
            'Jupyter',
          ],

          projects: [
            'Data Analysis',
            'Automation Scripts',
          ],

          resources: [
            'Kaggle',
            'Coursera',
          ],

          interviewPrep: [
            'Python Basics',
          ],

          certifications: [
            'Python Certification',
          ],
        },

        {
          phase:
            'Machine Learning',

          duration:
            isFast
              ? '1 Month'
              : '3 Months',

          skills: [
            'ML',
            'Scikit Learn',
            'Data Visualization',
          ],

          tools: [
            'Google Colab',
            'Kaggle',
          ],

          projects: [
            'Prediction System',
            'Recommendation Engine',
          ],

          resources: [
            'FastAI',
            'Google ML Crash Course',
          ],

          interviewPrep: [
            'ML Algorithms',
          ],

          certifications: [
            'Machine Learning',
          ],
        },

        ...(isLong
          ? [
              {
                phase:
                  'Advanced AI',

                duration:
                  '5 Months',

                skills: [
                  'Deep Learning',
                  'Transformers',
                  'LLMs',
                  'Deployment',
                ],

                tools: [
                  'PyTorch',
                  'HuggingFace',
                ],

                projects: [
                  'AI Chatbot',
                  'Custom LLM',
                ],

                resources: [
                  'HuggingFace Docs',
                ],

                interviewPrep: [
                  'AI System Design',
                ],

                certifications: [
                  'Deep Learning',
                ],
              },
            ]
          : []),
      ],
    }
  }

  // DEFAULT

  return {

    title: goal,

    timeline,

    salaryRange:
      '₹5L - ₹15L',

    jobRoles: [
      goal,
    ],

    phases: [

      {
        phase:
          'Foundation',

        duration:
          '1 Month',

        skills: [
          'Core Fundamentals',
          'Projects',
        ],

        tools: [
          'VS Code',
          'GitHub',
        ],

        projects: [
          'Starter Project',
        ],

        resources: [
          'YouTube',
          'Docs',
        ],

        interviewPrep: [
          'Basics',
        ],

        certifications: [
          'Foundation Certificate',
        ],
      },
    ],
  }
}

export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.json()

    const {
      goal,
      timeline,
    } = body

    const roadmap =
      generateRoadmap(
        goal,
        timeline
      )

    return NextResponse.json(
      roadmap
    )

  } catch (error) {

    return NextResponse.json(
      {
        error:
          'Roadmap generation failed',
      },
      {
        status: 500,
      }
    )
  }
}