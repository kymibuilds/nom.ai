import { getCommitHashes, pollCommits } from "./github";
import { db } from "@/server/db";

async function main() {
  const projectId = process.argv[2];

  if (!projectId) {
    console.log("Usage: bun run src/lib/test-github.ts <projectId>");
    process.exit(1);
  }

  console.log("=== TEST 1: Fetch project GitHub URL ===");
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { githubUrl: true },
    });

    console.log("Project:", project);
  } catch (e) {
    console.log("Test 1 failed:", e);
    process.exit(1);
  }

  console.log("\n=== TEST 2: getCommitHashes() ===");
  try {
    const githubUrl = (
      await db.project.findUnique({
        where: { id: projectId },
        select: { githubUrl: true },
      })
    )?.githubUrl;

    if (!githubUrl) throw new Error("No githubUrl found for project");

    const commits = await getCommitHashes(githubUrl);

    console.log("Fetched commits:", commits.length);
    console.log(commits.slice(0, 3));
  } catch (e) {
    console.log("Test 2 failed:", e);
    process.exit(1);
  }

  console.log("\n=== TEST 3: pollCommits() end-to-end ===");
  try {
    const result = await pollCommits(projectId);

    console.log("pollCommits result:", result);
  } catch (e) {
    console.log("Test 3 failed:", e);
    process.exit(1);
  }

  console.log("\nAll tests completed.");
}

await main();
