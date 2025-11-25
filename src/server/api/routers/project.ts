import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";
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
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          githubUrl: input.githubUrl,
          userToProjects: {
            create: { userId: ctx.user.userId },
          },
        },
      });

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
        }
      );

      const diff = res.data as unknown as string;
      const summary = await aiSummarizeCommit(diff);

      return ctx.db.commit.update({
        where: { id: input.commitId },
        data: { summary },
      });
    }),
});