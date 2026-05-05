"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const skillData: Record<string, string[]> = {
  Technology: [
    "Computer Science",
    "AI",
    "Data Science",
    "Cybersecurity",
    "Software Engineering",
    "Cloud",
    "UI/UX",
  ],

  "Commerce & Business": [
    "Finance",
    "Accounting",
    "Marketing",
    "Management",
    "Entrepreneurship",
  ],

  Science: [
    "Physics",
    "Chemistry",
    "Biology",
    "Botany",
    "Zoology",
    "Astronomy",
    "Microbiology",
  ],

  "Arts & Creativity": [
    "Music",
    "Art",
    "Dance",
    "Theatre",
    "Design",
    "Fashion",
    "Film",
    "Creative Writing",
  ],

  Humanities: [
    "Psychology",
    "Sociology",
    "History",
    "Philosophy",
    "Political Science",
  ],

  "Law & Public Service": [
    "Law",
    "UPSC",
    "Governance",
    "Public Policy",
  ],

  Health: [
    "Medicine",
    "Nursing",
    "Pharmacy",
    "Nutrition",
  ],

  Engineering: [
    "Mechanical",
    "Civil",
    "Electrical",
    "Electronics",
  ],

  "Nature & Research": [
    "Environmental Science",
    "Geology",
    "Oceanography",
    "Ecology",
  ],

  Other: ["Other"],
};

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    education: "",
    field: "",
    interests: "",
    goal: "",
    level: "",
    learning: "",
    manualSkills: "",
    otherSkill: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(
        selectedSkills.filter((s) => s !== skill)
      );
    } else {
      setSelectedSkills([
        ...selectedSkills,
        skill,
      ]);
    }
  };

  const nextStep = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password
    ) {
      setMsg("Please fill all details.");
      return;
    }

    setMsg("");

    const res = await fetch(
      "/api/auth/check-email",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email: form.email,
        }),
      }
    );

    const data = await res.json();

    if (data.exists) {
      setMsg(
        "User already exists. Please login."
      );
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.age ||
      !form.education ||
      !form.field ||
      !form.goal ||
      !form.level ||
      !form.learning
    ) {
      setMsg("Please complete all fields.");
      return;
    }

    setLoading(true);
    setMsg("");

    const finalSkills =
      form.otherSkill
        ? [
            ...selectedSkills,
            form.otherSkill,
          ]
        : selectedSkills;

    const payload = {
      ...form,
      manualSkills:
        finalSkills.join(", "),
      skills: finalSkills,
    };

    const res = await fetch(
      "/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      await signIn(
        "credentials",
        {
          email: form.email,
          password:
            form.password,
          redirect: false,
        }
      );

      router.replace("/");
    } else {
      setMsg(
        data.message ||
          "Signup failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dfe6f5] px-6 py-10">
      <div className="w-full max-w-md text-center">

        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="SkillSage"
            width={88}
            height={88}
            className="rounded-xl shadow-md"
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to{" "}
          <span className="text-blue-600">
            SkillSage
          </span>
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Create your account and begin your journey
        </p>

        {msg && (
          <p className="text-red-500 mb-4 text-sm">
            {msg}
          </p>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form
            onSubmit={nextStep}
            className="space-y-5"
          >
            <input
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="input"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="input"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              minLength={6}
              required
              onChange={handleChange}
              className="input"
            />

            <button
              type="submit"
              className="btn"
            >
              Let’s Dive In
            </button>

            <p className="text-gray-600 mt-5">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="number"
              name="age"
              placeholder="Age"
              onChange={handleChange}
              className="input"
            />

            <select
              name="education"
              onChange={handleChange}
              className="input"
            >
              <option value="">
                Education Level
              </option>
              <option>
                After 10th
              </option>
              <option>
                After 12th
              </option>
              <option>
                Diploma
              </option>
              <option>
                Graduation
              </option>
              <option>
                Post Graduation
              </option>
            </select>

            {/* MAIN CATEGORY */}
            <select
              name="field"
              onChange={handleChange}
              className="input"
            >
              <option value="">
                Your Skills Category
              </option>

              {Object.keys(
                skillData
              ).map((item) => (
                <option
                  key={item}
                >
                  {item}
                </option>
              ))}
            </select>

            {/* MULTI SELECT */}
            {form.field && (
              <div className="bg-white rounded-2xl p-4 text-left border">
                <p className="font-semibold mb-3">
                  Specify Skills
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {skillData[
                    form.field
                  ]?.map(
                    (skill) => (
                      <label
                        key={skill}
                        className="text-sm flex gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(
                            skill
                          )}
                          onChange={() =>
                            toggleSkill(
                              skill
                            )
                          }
                        />
                        {skill}
                      </label>
                    )
                  )}
                </div>
              </div>
            )}

            {/* OTHER */}
            {form.field ===
              "Other" && (
              <input
                name="otherSkill"
                placeholder="Mention your field"
                onChange={
                  handleChange
                }
                className="input"
              />
            )}

            <select
  name="goal"
  onChange={handleChange}
  className="input"
>
  <option value="">
    Career Goal
  </option>

  <option>Software Engineer</option>
  <option>Data Scientist</option>
  <option>AI / ML Engineer</option>
  <option>Cybersecurity Expert</option>
  <option>Cloud Engineer</option>

  <option>Doctor</option>
  <option>Pharmacist</option>
  <option>Psychologist</option>

  <option>Lawyer</option>
  <option>Judge / Civil Services</option>

  <option>CA / Finance Professional</option>
  <option>Business Owner</option>
  <option>Marketing Expert</option>

  <option>Professor / Teacher</option>
  <option>Research Scientist</option>

   <option>Artist</option>
   <option>Designer</option>
  <option>Musician</option>
  <option>Writer</option>

  <option>Government Job</option>
  <option>UPSC / IAS</option>

  <option>Undecided / Need Guidance</option>
  <option>Other</option>
</select>

            <select
              name="level"
              onChange={handleChange}
              className="input"
            >
              <option value="">
                Current Skill Level
              </option>
              <option>
                Beginner
              </option>
              <option>
                Intermediate
              </option>
              <option>
                Advanced
              </option>
            </select>

            <select
              name="learning"
              onChange={handleChange}
              className="input"
            >
              <option value="">
                Preferred Learning Style
              </option>
              <option>
                Video Based
              </option>
              <option>
                Reading Based
              </option>
              <option>
                Hands-on Practice
              </option>
              <option>
                Mixed
              </option>
            </select>

            <button
              type="submit"
              className="btn"
            >
              {loading
                ? "Creating..."
                : "Sign Up"}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          height: 56px;
          padding: 0 18px;
          border-radius: 18px;
          background: white;
          border: 1px solid #e5e7eb;
          outline: none;
        }

        .input:hover {
          box-shadow: 0 8px 18px rgba(0,0,0,0.08);
        }

        .btn {
          width: 100%;
          height: 56px;
          border-radius: 18px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          font-size: 18px;
        }

        .btn:hover {
          background: #1d4ed8;
        }
      `}</style>
    </div>
  );
}