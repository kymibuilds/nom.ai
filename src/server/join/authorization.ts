import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

/**
 * Returns the member row (role included) or null if user is not in project.
 */
export async function getMembership(userId: string, projectId: string) {
  return db.userToProject.findFirst({
    where: { userId, projectId },
    select: { role: true },
  });
}

/**
 * Ensures the user belongs to the project.
 * Throws FORBIDDEN if not.
 */
export async function assertMember(userId: string, projectId: string) {
  const membership = await getMembership(userId, projectId);

  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Not a project member",
    });
  }

  return membership;
}

/**
 * Ensures the user is ADMIN in the project.
 * Throws FORBIDDEN if not.
 */
export async function assertAdmin(userId: string, projectId: string) {
  const membership = await getMembership(userId, projectId);

  // ESLint-friendly optional chaining version
  if (membership?.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin only",
    });
  }

  return membership;
}
