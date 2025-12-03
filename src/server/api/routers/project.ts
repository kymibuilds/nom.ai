import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { checkCredits, indexGithubRepo } from "@/lib/github-loader";
import { aiSummarizeCommit } from "@/lib/gemini";
import { Octokit } from "octokit";
import { parseGitHubUrl } from "@/lib/github";

function getClient(token?: string) {
  return new Octokit({
    auth: token ?? process.env.GITHUB_TOKEN,
  });
}

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Count repo files (credits needed)
      const requiredCredits = await checkCredits(
        input.githubUrl,
        input.githubToken,
      );

      // 2. Get user’s available credits
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.user.userId },
        select: { credits: true },
      });

      if (!user) throw new Error("User not found");

      // 3. Compare
      if (user.credits < requiredCredits) {
        throw new Error(
          `Not enough credits. Repo requires ${requiredCredits}, but you only have ${user.credits}.`,
        );
      }

      // 4. Deduct credits BEFORE processing repo
      await ctx.db.user.update({
        where: { id: ctx.user.userId },
        data: {
          credits: {
            decrement: requiredCredits,
          },
        },
      });

      // 5. Create project
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          githubUrl: input.githubUrl,
          userToProjects: {
            create: { userId: ctx.user.userId, role: "ADMIN" },
          },
        },
      });

      // 6. Process repo
      await pollCommits(project.id, input.githubToken);
      await indexGithubRepo(project.id, input.githubUrl, input.githubToken);

      return project;
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        deletedAt: null,
        userToProjects: { some: { userId: ctx.user.userId } },
      },
    });
  }),

  getCommits: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.commit.findMany({
        where: { projectId: input.projectId },
        orderBy: { commitDate: "desc" },
      });
    }),

  regenerateCommitSummary: protectedProcedure
    .input(z.object({ commitId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const commit = await ctx.db.commit.findUnique({
        where: { id: input.commitId },
        include: { project: true },
      });

      if (!commit) throw new Error("Commit not found");

      const { owner, repo } = parseGitHubUrl(commit.project.githubUrl);
      const client = getClient();

      const res = await client.request(
        "GET /repos/{owner}/{repo}/commits/{ref}",
        {
          owner,
          repo,
          ref: commit.commitHash,
          headers: { Accept: "application/vnd.github.v3.diff" },
        },
      );

      const diff = res.data as unknown as string;
      const summary = await aiSummarizeCommit(diff);

      return ctx.db.commit.update({
        where: { id: input.commitId },
        data: { summary },
      });
    }),

  saveAnswer: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        filesReferences: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.question.create({
        data: {
          projectId: input.projectId,
          userId: ctx.user.userId,
          question: input.question,
          answer: input.answer,
          filesReferences: input.filesReferences ?? null,
        },
      });
    }),

  getQuestions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.question.findMany({
        where: {
          projectId: input.projectId,
          userId: ctx.user.userId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  uploadMeeting: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        meetingUrl: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const meeting = await ctx.db.meeting.create({
        data: {
          name: input.name,
          meetingUrl: input.meetingUrl,
          projectId: input.projectId,
          status: "PROCESSING",
        },
      });

      return meeting;
    }),

  getMeetings: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.meeting.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          issues: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  deleteMeeting: protectedProcedure
    .input(z.object({ meetingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.meeting.delete({
        where: { id: input.meetingId },
      });
    }),
  getMeetingById: protectedProcedure
    .input(z.object({ meetingId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.meeting.findUnique({
        where: { id: input.meetingId },
        include: {
          issues: true,
        },
      });
    }),
  archiveProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
  getTeamMembers: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.userToProject.findMany({
        where: { projectId: input.projectId },
        include: { user: true },
      });
    }),
  getMyCredits: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: { id: ctx.user.userId },
      select: { credits: true },
    });
  }),
  checkCredits: protectedProcedure
    .input(
      z.object({
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const fileCount = await checkCredits(input.githubUrl, input.githubToken);
      const userCredits = await ctx.db.user.findUnique({
        where: { id: ctx.user.userId },
        select: { credits: true },
      });

      return {
        fileCount,
        userCredits: userCredits?.credits ?? 0,
      };
    }),
    getDashboardStats: protectedProcedure
  .input(z.object({ projectId: z.string() }))
  .query(async ({ ctx, input }) => {
    const { projectId } = input;

    const [teamCount, commitCount, meetingCount, issueCount, lastCommit] = await Promise.all([
      ctx.db.userToProject.count({ where: { projectId } }),
      ctx.db.commit.count({ where: { projectId } }),
      ctx.db.meeting.count({ where: { projectId } }),
      ctx.db.issue.count({
        where: { meeting: { projectId } },
      }),
      ctx.db.commit.findFirst({
        where: { projectId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      teamCount,
      commitCount,
      meetingCount,
      issueCount,
      lastActivity: lastCommit?.createdAt ?? null,
    };
  })
});
