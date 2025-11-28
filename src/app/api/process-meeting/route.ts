import { processMeeting } from "@/lib/assembly";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod";

const bodyParser = z.object({
  meetingUrl: z.string(),
  projectId: z.string(),
  meetingId: z.string(),
});

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { meetingUrl, projectId, meetingId } = bodyParser.parse(body);

    const { summaries } = await processMeeting(meetingUrl);

    await db.issue.createMany({
      data: summaries.map((s) => ({
        start: s.start,
        end: s.end,
        gist: s.gist,
        headline: s.gist || "untitled",
        summary: s.summary,
        projectId,
        meetingId,
      })),
    });
    await db.meeting.update({
        where: {id: meetingId}, data: {
            status: "COMPLETED",
            name: summaries[0]?.gist
        }
    })
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
