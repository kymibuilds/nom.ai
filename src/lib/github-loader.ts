import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import { db } from "@/server/db";

// ----------------------
// LOAD GITHUB REPO
// ----------------------
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

  const docs = await loader.load();
  return docs;
};

// ----------------------
// INDEX GITHUB REPO
// ----------------------
export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  // 1. Load repo files as LangChain Documents
  const docs = await loadGitubRepo(githubUrl, githubToken);

  // 2. Generate summary + embedding for each doc
  const processedDocs = await Promise.all(
    docs.map(async (doc: Document) => {
      const summary = await summariseCode(doc);
      const embedding = await generateEmbedding(summary);

      return {
        summary,
        embedding,
        sourceCode: doc.pageContent,
        fileName: doc.metadata.source,
      };
    }),
  );

  // 3. Store everything in DB
  const results = await Promise.allSettled(
    processedDocs.map(async (item, index) => {
      console.log(`processing ${index + 1} of ${processedDocs.length}`);

      // Log the embedding to debug
      console.log(`Embedding for ${item.fileName}:`, item.embedding ? 'exists' : 'missing');

      await db.sourceCodeEmbedding.create({
        data: {
          summary: item.summary,
          summaryEmbedding: item.embedding
            ? `[${item.embedding.join(",")}]`
            : null,
          sourceCode: item.sourceCode,
          fileName: item.fileName,
          projectId,
        } as any,
      });
    }),
  );

  // Log any failures
  const failures = results.filter(r => r.status === 'rejected');
  if (failures.length > 0) {
    console.error(`Failed to process ${failures.length} files:`);
    failures.forEach((failure, i) => {
      console.error(`Failure ${i + 1}:`, failure.reason);
    });
  }

  return { success: true, processed: results.length, failed: failures.length };
};