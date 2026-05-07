'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CareerCounselorPage() {
  const router = useRouter()

  const counselors = [
    {
      name: 'Abhishek Halder',
      age: 42,
      education: 'MBA, Career Strategy',
      expert: 'Career Switching, Job Growth',
      exp: '14 Years',
      fees: '₹499/hr',
      image: '/counselors/abhishek halder.jpg',
    },
    {
      name: 'Charushila Narulla',
      age: 38,
      education: 'MBA HR, Career Coach',
      expert: 'Interviews, Resume Building',
      exp: '12 Years',
      fees: '₹449/hr',
      image: '/counselors/charushila narulla.jpg',
    },
    {
      name: 'Anand Kumar',
      age: 48,
      education: 'PhD, Education Advisor',
      expert: 'Competitive Exams, IIT/GATE',
      exp: '20 Years',
      fees: '₹599/hr',
      image: '/counselors/Anand kumar.jpeg',
    },
    {
      name: 'Ashka Mistry',
      age: 29,
      education: 'MA Psychology',
      expert: 'Stress, Confidence, Motivation',
      exp: '6 Years',
      fees: '₹299/hr',
      image: '/counselors/ashka mistry.jpeg',
    },
    {
      name: 'Amar Ingavale',
      age: 39,
      education: 'M.Tech, Student Mentor',
      expert: 'Engineering Guidance, Higher Studies',
      exp: '11 Years',
      fees: '₹399/hr',
      image: '/counselors/amar ingavale.webp',
    },
    {
      name: 'Prachi Mehra',
      age: 34,
      education: 'MS Abroad Education',
      expert: 'Study Abroad, SOP, Scholarships',
      exp: '9 Years',
      fees: '₹499/hr',
      image: '/counselors/Prachi Mehra.jpg',
    },
    {
      name: 'Sheikh Mohammad Asif',
      age: 33,
      education: 'MBA Finance',
      expert: 'Finance Career, MBA Roadmap',
      exp: '8 Years',
      fees: '₹399/hr',
      image: '/counselors/sheikh mohommad asif.webp',
    },
    {
      name: 'Shampa Goswami',
      age: 31,
      education: 'MSc Counselling Psychology',
      expert: 'Mental Wellness, Student Pressure',
      exp: '7 Years',
      fees: '₹349/hr',
      image: '/counselors/shampa goswami.webp',
    },
    {
      name: 'Prem Kshirsagar',
      age: 55,
      education: 'PhD Management',
      expert: 'Leadership, Corporate Growth',
      exp: '25 Years',
      fees: '₹699/hr',
      image: '/counselors/Prem Kshirsagar.jpeg',
    },
    {
      name: 'Sherin Thomas',
      age: 30,
      education: 'MBA, Career Development',
      expert: 'Freshers Jobs, Placement Prep',
      exp: '7 Years',
      fees: '₹349/hr',
      image: '/counselors/sherin thomas.webp',
    },
  ]

  return (
    <div className="min-h-screen bg-[#dfe6f5] px-6 py-8">
      {/* Top */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="SkillSage"
            width={95}
            height={95}
          />

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Career Counselor
            </h1>

            <p className="text-gray-600">
              Take help of professionals to build your future.
            </p>
          </div>
        </div>

        
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {counselors.map((item, index) => (
          <div
          key={index}
          className="bg-white rounded-3xl shadow-md overflow-hidden transition duration-300 flex flex-col h-[550px] hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]"
          >
            <div className="relative w-full h-72 overflow-hidden bg-gray-100">
            <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover object-center"
            />
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {item.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {item.age} yrs • {item.education}
              </p>

              <div className="mt-3 text-sm space-y-2 text-gray-700">
                <p>
                  <span className="font-semibold">
                    Expert In:
                  </span>{' '}
                  {item.expert}
                </p>

                <p>
                  <span className="font-semibold">
                    Experience:
                  </span>{' '}
                  {item.exp}
                </p>

                <p>
                  <span className="font-semibold">
                    Fees:
                  </span>{' '}
                  {item.fees}
                </p>
              </div>

              <button className="mt-auto w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}