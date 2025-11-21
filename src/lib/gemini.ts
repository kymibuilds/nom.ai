import { GoogleGenAI } from "@google/genai";
import type { Document } from "@langchain/core/documents";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper to add delays between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Track request timing to stay under rate limits
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 7000; // 7 seconds between requests (60s / 10 requests = 6s, +1s buffer)

async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`⏳ Waiting ${Math.round(waitTime / 1000)}s for rate limit...`);
    await delay(waitTime);
  }
  
  lastRequestTime = Date.now();
}

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
    await waitForRateLimit();
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log("Gemini summary:", text.slice(0, 100));
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    
    // If rate limited, wait the suggested retry time
    if (error?.status === 429) {
      console.log("⚠️ Rate limited, waiting 60 seconds...");
      await delay(60000);
    }
    
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

  try {
    await waitForRateLimit();
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return text;
  } catch (error) {
    console.error("Gemini API error for", doc.metadata.source, ":", error);
    
    if (error?.status === 429) {
      console.log("⚠️ Rate limited, waiting 60 seconds...");
      await delay(60000);
      // Retry once after waiting
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
    
    return "";
  }
}

export async function generateEmbedding(summary: string) {
  if (!summary) {
    console.log("⚠️ Empty summary, skipping embedding generation");
    return undefined;
  }
  
  try {
    await waitForRateLimit();
    
    const result = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: [{ text: summary }],
    });

    const embedding = result.embeddings?.[0];
    return embedding?.values;
  } catch (error) {
    console.error("Embedding API error:", error);
    
    if (error?.status === 429) {
      console.log("⚠️ Rate limited on embedding, waiting 60 seconds...");
      await delay(60000);
      // Retry once
      try {
        const result = await ai.models.embedContent({
          model: "text-embedding-004",
          contents: [{ text: summary }],
        });
        return result.embeddings?.[0]?.values;
      } catch (retryError) {
        console.error("Embedding retry failed:", retryError);
        return undefined;
      }
    }
    
    return undefined;
  }
}