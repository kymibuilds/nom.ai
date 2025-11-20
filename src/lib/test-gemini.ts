import { aiSummarizeCommit } from "./gemini";

const fakeDiff = `
diff --git a/test.js b/test.js
index 123..456 100644
--- a/test.js
+++ b/test.js
@@ -1,2 +1,2 @@
-console.log("hello");
+console.log("hello world");
`;

const run = async () => {
  const summary = await aiSummarizeCommit(fakeDiff);
  console.log("SUMMARY OUTPUT:");
  console.log(summary);
};

await run();
