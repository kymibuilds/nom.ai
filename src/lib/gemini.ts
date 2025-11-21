import { GoogleGenAI } from "@google/genai";
import type { Document } from "@langchain/core/documents";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function aiSummarizeCommit(diff: string) {
  const prompt = `You are an expert programmer, and you are trying to summarize a git diff.
Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`

This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with \`+\` means it was added.
A line that starting with \`-\` means that line was deleted.
A line that starts with neither \`+\` nor \`-\` is code given for context.
It is not part of the diff.

EXAMPLE SUMMARY COMMENTS:
\`\`\`
- Raised the returned recordings from 10 to 100
- Fixed a typo in GitHub action name
- Moved octokit initialization
- Added an OpenAI API for completions
- Lowered numeric tolerance for tests
\`\`\`

Do not include these example comments.
Summarize the following diff:

${diff}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log("Gemini summary:", text.slice(0, 100));
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "";
  }
}

export async function summariseCode(doc: Document) {
  console.log("getting summary for", doc.metadata.source);

  const code = doc.pageContent.slice(0, 10000);

  const prompt = `
You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects.
You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.

Here is the code:
---
${code}
---

Give a summary no more than 100 words of the code above.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ text: prompt }],
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text;
}

export async function generateEmbeddings(summary: string) {
  const result = await ai.models.embedContent({
    model: "text-embedding-004",
    contents: [{ text: summary }],
  });

  // Use the first embedding
  const embedding = result.embeddings?.[0];
  return embedding?.values;
}

console.log(await generateEmbeddings("hello world"))
