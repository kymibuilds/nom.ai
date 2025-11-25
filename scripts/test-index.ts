import { indexGithubRepo } from "@/lib/github-loader";
import { db } from "@/server/db.js";
import "dotenv/config";

async function main() {
  const githubUrl = "https://github.com/octocat/Hello-World";

  
  const project = await db.project.create({
    data: {
      name: "Test " + Date.now(),
      githubUrl,
    },
  });

  console.log("Created project:", project.id);
  console.log("Starting index job...");

  try {
    await indexGithubRepo(project.id, githubUrl, process.env.GITHUB_TOKEN);
    console.log("Index job completed.");
  } catch (err) {
    console.error("Index job failed:", err);
  }
}

await main();