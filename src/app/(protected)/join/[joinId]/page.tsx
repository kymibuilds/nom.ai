import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ projectId: string }>;
};

const JoinHandler = async ({ params }: Props) => {
  try {
    const { projectId } = await params;
    const { userId } = await auth();

    if (!userId) return redirect("/sign-in");

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    let emailAddress =
      clerkUser.emailAddresses?.[0]?.emailAddress ??
      clerkUser.primaryEmailAddress?.emailAddress ??
      "";

    let firstName = clerkUser.firstName ?? "";
    let lastName = clerkUser.lastName ?? "";
    let imageUrl = clerkUser.imageUrl ?? "";

    let dbUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      emailAddress ??= "";
      firstName ??= "";
      lastName ??= "";
      imageUrl ??= "";

      dbUser = await db.user.create({
        data: {
          id: userId,
          emailAddress,
          firstName,
          lastName,
          imageUrl,
        },
      });
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) return redirect("/dashboard");

    const existingJoin = await db.userToProject.findFirst({
      where: {
        userId: dbUser.id,
        projectId,
      },
    });

    if (!existingJoin) {
      await db.userToProject.create({
        data: {
          userId: dbUser.id,
          projectId,
        },
      });
    }

    return redirect(`/dashboard`);
  } catch (error) {
    console.error("JoinHandler error:", error);
    return redirect("/error");
  }
};

export default JoinHandler;
