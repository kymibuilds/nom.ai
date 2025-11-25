import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";

// --------------------------------------------------
// Load GitHub repository
// --------------------------------------------------
export const loadGitubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken ?? "",
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

  return loader.load();
};

// --------------------------------------------------
// Index GitHub repo → summarize → embed → store
// --------------------------------------------------
export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGitubRepo(githubUrl, githubToken);

  const allEmbeddings = await generateEmbeddings(docs);

  await Promise.allSettled(
    allEmbeddings.map(async (item, index) => {
      console.log(`Embedding ${index} generated`);

      console.log("Summary:", item.summary);
      console.log("Embedding:", item.embedding);

      if (!item.embedding) return;

      // Insert metadata row
      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          summary: item.summary,
          sourceCode: item.sourceCode,
          fileName: item.fileName,
          projectId,
        },
      });

      // Insert pgvector embedding (correct bracket syntax)
      await db.$executeRawUnsafe(`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = '[${item.embedding.join(",")}]'::vector
        WHERE id = '${sourceCodeEmbedding.id}'
      `);
    })
  );
};

// --------------------------------------------------
// Generate all summaries + embeddings
// --------------------------------------------------
const generateEmbeddings = async (docs: Document[]) => {
  return Promise.all(
    docs.map(async (doc) => {
      const summary = await summariseCode(doc);
      const embedding = await generateEmbedding(summary);

      return {
        summary,
        embedding,
        sourceCode: doc.pageContent,
        fileName: doc.metadata.source,
      };
    })
  );
};
