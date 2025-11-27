"use server";

import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";

export async function askQuestion(question: string, projectId: string) {
  const embedding = await generateEmbedding(question);
  if (!embedding) {
    throw new Error("Failed to generate embedding for query");
  }

  const vectorQuery = `[${embedding.join(",")}]`;

  const result = await db.$queryRaw<
    { fileName: string; sourceCode: string; summary: string; similarity: number }[]
  >`
    SELECT 
      "fileName",
      "sourceCode",
      "summary",
      1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE ("summaryEmbedding" <=> ${vectorQuery}::vector) < 0.8
      AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10
  `;

  let context = "";
  for (const doc of result) {
    context += `
source: ${doc.fileName}
code content:
${doc.sourceCode}

summary:
${doc.summary}

----------------------------
`;
  }

  const { textStream } = streamText({
    model: google("gemini-2.0-flash"),
    prompt: `
You are a code assistant that answers questions about the codebase.

Use ONLY the context provided below.

If the answer cannot be found in the context, say:
"I don't know."

CONTEXT START
${context}
CONTEXT END

QUESTION:
${question}

Provide the answer in Markdown with code snippets when relevant.
    `,
  });

  return {
    textStream,
    filesReferences: result,
  };
}