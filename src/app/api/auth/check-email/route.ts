import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await db.user.findUnique({
    where: { email },
  });

  return NextResponse.json({
    exists: !!user,
  });
}