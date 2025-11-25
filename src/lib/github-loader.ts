import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";
import { parseGitHubUrl } from "@/lib/github";
import { Octokit } from "octokit";

function getClient(githubToken?: string) {
  return new Octokit({
    auth: githubToken || process.env.GITHUB_TOKEN,
  });
}

export const loadGitubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const { owner, repo } = parseGitHubUrl(githubUrl);
  const client = getClient(githubToken);

  const repoInfo = await client.rest.repos.get({ owner, repo });
  const defaultBranch = repoInfo.data.default_branch;

  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken ?? "",
    branch: defaultBranch,
    ignoreFiles: [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });

  return loader.load();
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGitubRepo(githubUrl, githubToken);
  const processed = await generateEmbeddings(docs);

  await Promise.allSettled(
    processed.map(async (item, idx) => {
      if (!item.embedding) return;

      const row = await db.sourceCodeEmbedding.create({
        data: {
          summary: item.summary,
          sourceCode: item.sourceCode,
          fileName: item.fileName,
          projectId,
        },
      });

      await db.$executeRawUnsafe(`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = '[${item.embedding.join(",")}]'::vector
        WHERE id = '${row.id}'
      `);
    })
  );
};

const generateEmbeddings = async (docs: Document[]) => {
  return Promise.all(
    docs.map(async (doc) => {
      const filePath = doc.metadata.source || "unknown";
      const size = Buffer.byteLength(doc.pageContent || "");

      if (!shouldIndex(filePath, size)) {
        return {
          summary: "",
          embedding: undefined,
          sourceCode: "",
          fileName: filePath,
        };
      }

      const summary = await summariseCode(doc);
      const embedding = await generateEmbedding(summary);

      return {
        summary,
        embedding,
        sourceCode: doc.pageContent,
        fileName: filePath,
      };
    })
  );
};

function shouldIndex(path: string, size: number) {
  const skipFolders = [
    "node_modules",
    ".next",
    "dist",
    "build",
    "vendor",
    "out",
  ];

  if (skipFolders.some((f) => path.includes(`/${f}/`))) return false;

  const skipExt = [
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg",
    ".zip", ".tar", ".gz",
    ".pdf", ".mp4", ".mp3",
    ".ico", ".lock",
  ];

  if (skipExt.some((ext) => path.endsWith(ext))) return false;

  if (size > 200_000) return false;

  return true;
}