import { db } from "@/server/db";
import { Octokit } from "octokit";
import { aiSummarizeCommit } from "./gemini";

type CommitInfo = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

/* --------------------------------------------
   SAFE URL PARSER
-------------------------------------------- */
export function parseGitHubUrl(url: string) {
  try {
    const clean = url.replace(/\/+$/, "");
    const parts = clean.split("/").filter(Boolean);
    const repo = parts.at(-1);
    const owner = parts.at(-2);

    if (!owner || !repo) throw new Error("Invalid GitHub repo URL");

    return { owner, repo };
  } catch {
    throw new Error("Invalid GitHub repo URL");
  }
}

/* --------------------------------------------
   CREATE OCTOKIT INSTANCE
-------------------------------------------- */
function getClient(githubToken?: string) {
  return new Octokit({
    auth: githubToken ?? process.env.GITHUB_TOKEN,
  });
}

/* --------------------------------------------
   FETCH COMMITS
-------------------------------------------- */
export const getCommitHashes = async (
  githubUrl: string,
  githubToken?: string
): Promise<CommitInfo[]> => {
  const { owner, repo } = parseGitHubUrl(githubUrl);
  const client = getClient(githubToken);

  console.log("Fetching commits for:", owner, repo);

  const repoInfo = await client.rest.repos.get({ owner, repo });
  const branch = repoInfo.data.default_branch;

  const { data } = await client.rest.repos.listCommits({
    owner,
    repo,
    sha: branch,
    per_page: 20,
  });

  const sorted = [...data].sort((a, b) => {
    const t1 = new Date(a.commit.author?.date ?? 0).getTime();
    const t2 = new Date(b.commit.author?.date ?? 0).getTime();
    return t2 - t1;
  });

  return sorted.slice(0, 15).map((c) => ({
    commitHash: c.sha,
    commitMessage: c.commit.message,
    commitAuthorName: c.commit.author?.name ?? "",
    commitAuthorAvatar: c.author?.avatar_url ?? "",
    commitDate: c.commit.author?.date ?? "",
  }));
};

/* --------------------------------------------
   SUMMARIZE SINGLE COMMIT
-------------------------------------------- */
async function summariseCommit(
  githubUrl: string,
  commitHash: string,
  githubToken?: string
) {
  const { owner, repo } = parseGitHubUrl(githubUrl);
  const client = getClient(githubToken);

  try {
    const res = await client.request(
      "GET /repos/{owner}/{repo}/commits/{ref}",
      {
        owner,
        repo,
        ref: commitHash,
        headers: { Accept: "application/vnd.github.v3.diff" },
      }
    );

    const diff = res.data as unknown as string;
    return (await aiSummarizeCommit(diff)) ?? "";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    
    console.log("Commit summary failed:", commitHash);
    return "";
  }
}

/* --------------------------------------------
   WRITE NEW COMMITS ONLY
-------------------------------------------- */
export const pollCommits = async (
  projectId: string,
  githubToken?: string
) => {
  const githubUrl = await fetchProjectGithubUrl(projectId);

  const commits = await getCommitHashes(githubUrl, githubToken);
  const unprocessed = await filterUnprocessedCommits(projectId, commits);

  const summaries = await Promise.all(
    unprocessed.map((c) =>
      summariseCommit(githubUrl, c.commitHash, githubToken)
    )
  );

  return db.commit.createMany({
    data: unprocessed.map((c, i) => ({
      projectId,
      commitHash: c.commitHash,
      commitMessage: c.commitMessage,
      commitAuthorName: c.commitAuthorName,
      commitAuthorAvatar: c.commitAuthorAvatar,
      commitDate: new Date(c.commitDate),
      summary: summaries[i] ?? "",
    })),
    skipDuplicates: true,
  });
};

/* --------------------------------------------
   HELPERS
-------------------------------------------- */
async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  });

  if (!project?.githubUrl) throw new Error("Project missing GitHub URL");
  return project.githubUrl;
}

async function filterUnprocessedCommits(
  projectId: string,
  commits: CommitInfo[]
): Promise<CommitInfo[]> {
  const existing = await db.commit.findMany({
    where: { projectId },
    select: { commitHash: true },
  });

  const set = new Set(existing.map((c) => c.commitHash));
  return commits.filter((c) => !set.has(c.commitHash));
}
