import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollCommits, octokit } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";
import { aiSummarizeCommit } from "@/lib/gemini";

export const projectRouter = createTRPCRouter({

  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          githubUrl: input.githubUrl,
          userToProjects: {
            create: { userId: ctx.user.userId },
          },
        },
      });

      // Run initial commit indexing ONCE
      await pollCommits(project.id);

      // Run source code indexing ONCE
      await indexGithubRepo(project.id, input.githubUrl, input.githubToken);

      return project;
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        deletedAt: null,
        userToProjects: {
          some: { userId: ctx.user.userId },
        },
      },
    });
  }),

  getCommits: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Important fix: DO NOT CALL pollCommits HERE ANYMORE
      // It caused repeated endless polling & API spam.

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

      const githubUrl = commit.project.githubUrl;
      const parts = githubUrl.split("/").filter(Boolean);
      const owner = parts[parts.length - 2];
      const repo = parts[parts.length - 1];

      if (!owner || !repo) throw new Error("Invalid GitHub URL");

      const res = await octokit.request(
        "GET /repos/{owner}/{repo}/commits/{ref}",
        {
          owner,
          repo,
          ref: commit.commitHash,
          headers: { Accept: "application/vnd.github.v3.diff" },
        },
      );

      const diff = res.data as unknown as string;
      const newSummary = await aiSummarizeCommit(diff);

      if (!newSummary) {
        throw new Error("Failed to regenerate summary. Try later.");
      }

      return ctx.db.commit.update({
        where: { id: input.commitId },
        data: { summary: newSummary },
      });
    }),
});