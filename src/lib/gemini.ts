import { GoogleGenAI } from "@google/genai";
import type { Document } from "@langchain/core/documents";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function aiSummarizeCommit(diff: string) {
    const prompt = `You are an expert programmer, and you are trying to summarize a git diff.
Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):

diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js

This means that lib/index.js was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with '+' means it was added.
A line that starting with '-' means that line was deleted.
A line that starts with neither '+' nor '-' is code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY COMMENTS:

* Raised the amount of returned recordings from 10 to 100 [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
* Moved the octokit initialization to a separate file [src/octokit.ts], [src/index.ts]
* Added an OpenAI API for completions [packages/utils/apis/openai.ts]
* Lowered numeric tolerance for test files

Most commits will have less comments than this examples list.
The last comment does not include the file names,
because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments.
Please summarise the following diff file: \n\n
DO NOT SAY "here is the summary of the diff"

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
A line starting with '+' means it was added.
A line that starting with '-' means that line was deleted.
A line that starts with neither '+' nor '-' is code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY COMMENTS:
\`\`\`
* Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
* Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
* Added an OpenAI API for completions [packages/utils/apis/openai.ts]
* Lowered numeric tolerance for test files
\`\`\`
Most commits will have less comments than this examples list.
The last comment does not include the file names,
because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments.
Please summarise the following diff file: \n\n
${code}
    a summary in no more than 100 words.
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