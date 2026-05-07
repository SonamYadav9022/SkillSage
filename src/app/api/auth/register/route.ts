import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // Read body only once
    const body = await req.json();

    const {
      name,
      email,
      password,
      education,
      experience,
      skills,
      goal,
    } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Name, email and password are required",
        },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser =
      await db.user.findUnique({
        where: { email },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    // Encrypt password
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // Safe skills array
    const safeSkills =
      Array.isArray(skills)
        ? skills
        : [];

    // Create user
    await db.user.create({
  data: {
    name: name.trim(),

    email: email
      .trim()
      .toLowerCase(),

    password:
      hashedPassword,

    education:
      education || "",

    experience:
      experience || "",

    skills:
      Array.isArray(skills)
        ? skills.join(", ")
        : "",

    manualSkills:
      Array.isArray(skills)
        ? skills.join(", ")
        : "",

    goal:
      goal || "",
  },
});

    return NextResponse.json(
      {
        message:
          "Account created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(
      "REGISTER ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong",
      },
      { status: 500 }
    );
  }
}