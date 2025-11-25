"use client";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

function CommitLog() {
  const { projectId, project } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());
  
  const utils = api.useUtils();
  const regenerateMutation = api.project.regenerateCommitSummary.useMutation({
    onMutate: ({ commitId }) => {
      setRegeneratingIds(prev => new Set(prev).add(commitId));
    },
    onSuccess: (_, { commitId }) => {
      toast.success("Summary regenerated successfully!");
      utils.project.getCommits.invalidate({ projectId });
    },
    onError: (error, { commitId }) => {
      toast.error(`Failed to regenerate: ${error.message}`);
    },
    onSettled: (_, __, { commitId }) => {
      setRegeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(commitId);
        return next;
      });
    },
  });

  const handleRegenerate = (commitId: string) => {
    regenerateMutation.mutate({ commitId });
  };

  return (
    <>
      <ul className="space-y-6">
        {commits?.map((commit, commitIndex) => {
          const isRegenerating = regeneratingIds.has(commit.id);
          
          return (
            <li key={commit.id} className="relative flex gap-x-4">
              {/* Vertical Strip (Container width set to w-10 to center the line under the 40px avatar) */}
              <div
                className={cn(
                  commitIndex === commits.length - 1 ? "h-6" : "-bottom-6",
                  "absolute top-0 left-0 flex w-10 justify-center", // w-10 centers the line for the 40px avatar
                )}
              >
                {/* The vertical strip */}
                <div className="w-px bg-gray-200"></div>
              </div>
              {/* Avatar (Directly using w-10 h-10 and 40px props) */}
              <div className="relative z-10 mt-0.5 flex-none w-10 h-10">
                <Image
                  src={commit.commitAuthorAvatar}
                  alt="author avatar"
                  // Next.js Image component width/height props set to 40
                  width={40} 
                  height={40}
                  // Apply the 40px size class to the rendered image element
                  className="w-10 h-10 rounded-full bg-white ring-2 ring-white border-2 border-gray-200"
                />
              </div>
              {/* Commit block */}
              <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-gray-200 ring-inset">
                <div className="flex justify-between gap-x-4">
                  <Link
                    href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                    target="_blank"
                    className="py-0.5 text-xs leading-5 text-gray-500"
                  >
                    <span className="font-medium text-gray-900">
                      {commit.commitAuthorName}
                    </span>{" "}
                    <span className="inline-flex items-center">
                      committed
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </span>
                  </Link>
                  
                  <button
                    onClick={() => handleRegenerate(commit.id)}
                    disabled={isRegenerating}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Regenerate summary"
                  >
                    <RefreshCw 
                      className={cn(
                        "h-3 w-3",
                        isRegenerating && "animate-spin"
                      )} 
                    />
                    {isRegenerating ? "Regenerating..." : "Regenerate"}
                  </button>
                </div>
                <span className="font-semibold">{commit.commitMessage}</span>
                <pre className="mt-2 text-sm leading-6 whitespace-pre-wrap text-gray-500">
                  {commit.summary || (
                    <span className="italic text-gray-400">
                      No summary available
                    </span>
                  )}
                </pre>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default CommitLog;