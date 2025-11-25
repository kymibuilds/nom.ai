import { GoogleGenAI } from "@google/genai";
import type { Document } from "@langchain/core/documents";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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
      model: "gemini-2.0-flash",   // FIXED MODEL
      contents: [{ text: prompt }],
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "";
  }
}

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
      model: "gemini-2.5-flash",     // PRIMARY
      contents: [{ text: prompt }],
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch (error) {
    console.error("Gemini API error for", doc.metadata.source, ":", error);

    // Retry with a lighter valid model
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite",   // RETRY MODEL (valid)
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
      model: "text-embedding-004",    // VALID MODEL
      contents: [{ text: summary }],
    });

    return result.embeddings?.[0]?.values;
  } catch (error) {
    console.error("Embedding API error:", error);
    return undefined;
  }
}