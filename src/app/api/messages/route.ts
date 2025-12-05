import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  const body = await req.json();
  const { content } = body;

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!content)
    return NextResponse.json({ error: "Content is required" }, { status: 400 });

  const message = await db.message.create({
    data: {
      userId,
      content,
    },
  });

  return NextResponse.json(message);
}
