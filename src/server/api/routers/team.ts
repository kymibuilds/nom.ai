import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { assertAdmin } from "@/server/join/authorization";
import { generateJoinCode } from "@/server/join/generate";

export const teamRouter = createTRPCRouter({
  createJoinCode: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        ttlHours: z.number().optional().default(24),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, ttlHours } = input;
      const userId = ctx.user.userId;

      // Ensure admin
      await assertAdmin(userId, projectId);

      // Delete previous active codes
      await ctx.db.projectJoinCode.deleteMany({
        where: {
          projectId,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
      });

      // Compute expiration timestamp
      const expiresAt = new Date(Date.now() + ttlHours * 3600 * 1000);

      // Try creating a unique code (handles P2002)
      for (let i = 0; i < 5; i++) {
        const code = generateJoinCode();

        try {
          return await ctx.db.projectJoinCode.create({
            data: {
              projectId,
              code,
              expiresAt,
            },
            select: {
              code: true,
              expiresAt: true,
            },
          });
        } catch (err: any) {
          if (err.code === "P2002") continue; // Retry collision
          throw err;
        }
      }

      throw new Error("Failed to generate unique join code");
    }),

  joinByCode: protectedProcedure
    .input(
      z.object({
        code: z.string().length(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.userId;
      const code = input.code.trim();

      // Find the join code entry
      const codeRow = await ctx.db.projectJoinCode.findUnique({
        where: { code },
      });

      if (!codeRow) throw new Error("INVALID_CODE");
      if (codeRow.expiresAt < new Date()) throw new Error("EXPIRED_CODE");
      if (codeRow.usedAt) throw new Error("CODE_USED");

      const projectId = codeRow.projectId;

      // Add user to project (upsert ensures no duplicates)
      await ctx.db.userToProject.upsert({
        where: {
          userId_projectId: { userId, projectId },
        },
        update: {
          updatedAt: new Date(),
        },
        create: {
          userId,
          projectId,
          role: "MEMBER",
        },
      });

      // Mark code used (single-use behavior)
      await ctx.db.projectJoinCode.update({
        where: { id: codeRow.id },
        data: { usedAt: new Date() },
      });

      return {
        ok: true,
        projectId,
      };
    }),
});
