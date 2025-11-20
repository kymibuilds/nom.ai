import { db } from "@/server/db";
import { Octokit } from "octokit";
import { aiSummarizeCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
  console.log("Fetching commits for:", githubUrl);

  const [owner, repo] = githubUrl.split("/").slice(-2);

  if (!owner || !repo) {
    throw new Error("Invalid Github Url");
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  console.log("Raw GitHub commit count:", data.length);

  const sortedCommits = [...data].sort((a, b) => {
    const dateA = new Date(a.commit.author?.date ?? "").getTime();
    const dateB = new Date(b.commit.author?.date ?? "").getTime();
    return dateB - dateA;
  });

  console.log("Sorted commits:", sortedCommits.length);

  const mapped = sortedCommits.slice(0, 15).map((commit, i) => {
    console.log(`Commit #${i + 1}:`, {
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author?.name,
    });

    return {
      commitHash: commit.sha,
      commitMessage: commit.commit.message,
      commitAuthorName: commit.commit.author?.name ?? "",
      commitAuthorAvatar: commit.author?.avatar_url ?? "",
      commitDate: commit.commit.author?.date ?? "",
    };
  });

  console.log("Mapped commit objects:", mapped.length);
  return mapped;
};

export const pollCommits = async (projectId: string) => {
  const githubUrl = await fetchProjectGithubUrl(projectId);

  const commitHashes = await getCommitHashes(githubUrl);

  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  // Summaries ALWAYS return a string now
  const summaryResponses = await Promise.all(
    unprocessedCommits.map((commit) =>
      summariseCommit(githubUrl, commit.commitHash),
    ),
  );

  const commits = await db.commit.createMany({
    data: summaryResponses.map((summary, index) => {
      console.log(`processing commit ${index}`);
      return {
        projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: new Date(unprocessedCommits[index]!.commitDate),
        summary, // ALWAYS string now
      };
    }),
  });

  return commits;
};

async function summariseCommit(githubUrl: string, commitHash: string) {
  try {
    
    const [owner, repo] = githubUrl.split("/").slice(-2);

    if (!owner || !repo) {
      throw new Error("Invalid GitHub URL");
    }

    // Correct GitHub diff request
    const res = await octokit.request(
      "GET /repos/{owner}/{repo}/commits/{ref}",
      {
        owner,
        repo,
        ref: commitHash,
        headers: { Accept: "application/vnd.github.v3.diff" },
      },
    );

    const diff = res.data as unknown as string;
    console.log(res.headers["content-type"]);

    console.log(`✅ Fetched diff for commit ${commitHash.substring(0, 7)}`);

    const output = await aiSummarizeCommit(diff);

    console.log(
      `✅ Generated summary for commit ${commitHash.substring(0, 7)}`,
    );

    return output ?? "";
  } catch (err) {
    console.log("Failed summarizing commit:", commitHash, err);
    return "";
  }
}

async function fetchProjectGithubUrl(projectId: string): Promise<string> {
  console.log("Fetching GitHub URL for project:", projectId);

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  });

  if (!project?.githubUrl) {
    throw new Error("project has no github url");
  }

  return project.githubUrl;
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
): Promise<Response[]> {
  console.log("Filtering unprocessed commits for project:", projectId);

  const processedCommits = await db.commit.findMany({
    where: { projectId },
    select: { commitHash: true },
  });

  const processedHashes = new Set(processedCommits.map((c) => c.commitHash));

  return commitHashes.filter(
    (commit) => !processedHashes.has(commit.commitHash),
  );
}
