import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { doc } from "prettier";
import { promise } from "zod";
import { summariseCode } from "./gemini";

export const loadGitubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken && "",
    branch: "master",
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

  const docs = await loader.load();
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGitubRepo(githubUrl, githubToken);
  const allEmbeddings = await generateEmbeddings(docs);
};

const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async doc=>{
        const summary = await summariseCode(doc)
    }))
};
