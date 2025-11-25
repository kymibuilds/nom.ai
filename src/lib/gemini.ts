import { GoogleGenAI } from "@google/genai";
import type { Document } from "@langchain/core/documents";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ----------------------------------------------------
// Commit summarization
// ----------------------------------------------------
export async function aiSummarizeCommit(diff: string) {
  const prompt = `You are an expert programmer summarizing a git diff.

Lines starting with "+" are additions.
Lines starting with "-" are deletions.
Other lines are context only.

Summarize the following diff:

${diff}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ text: prompt }],
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "";
  }
}

// ----------------------------------------------------
// Code summarization
// ----------------------------------------------------
export async function summariseCode(doc: Document) {
  const code = doc.pageContent.slice(0, 10000);

  const prompt = `
You are explaining the purpose of the file ${doc.metadata.source} to a junior engineer.

Here is the code:
---
${code}
---

Provide a summary in no more than 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: prompt }],
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch (error) {
    console.error("Gemini API error for", doc.metadata.source, ":", error);

    // retry once
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ text: prompt }],
      });

      return response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    } catch (retryError) {
      console.error("Retry failed:", retryError);
      return "";
    }
  }
}

export async function generateEmbedding(summary: string) {
  if (!summary) return undefined;

  try {
    const result = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: [{ text: summary }],
    });

    const embedding = result.embeddings?.[0]?.values;

    return embedding;
  } catch (error) {
    console.error("Embedding API error:", error);
    return undefined;
  }
}