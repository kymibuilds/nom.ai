"use client";

import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function CommitLog() {
  const { projectId, project } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());
  
  const utils = api.useUtils();
  const regenerateMutation = api.project.regenerateCommitSummary.useMutation({
    onMutate: ({ commitId }) => {
      setRegeneratingIds(prev => new Set(prev).add(commitId));
    },
    onSuccess: async () => {
      toast.success("Summary regenerated successfully!");
      await utils.project.getCommits.invalidate({ projectId });
    },
    onError: (error) => {
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
    <ul className="space-y-6">
      {commits?.map((commit, commitIndex) => {
        const isRegenerating = regeneratingIds.has(commit.id);
        
        return (
          <li key={commit.id} className="relative flex gap-x-4">
            {/* Vertical Line */}
            <div
              className={cn(
                commitIndex === commits.length - 1 ? "h-6" : "-bottom-6",
                "absolute top-0 left-0 flex w-10 justify-center",
              )}
            >
              <div className="w-px bg-border" />
            </div>

            {/* Avatar */}
            <div className="relative mt-1 flex-none">
              <Avatar className="h-10 w-10 ring-4 ring-background border bg-background">
                <AvatarImage src={commit.commitAuthorAvatar} alt={commit.commitAuthorName} />
                <AvatarFallback>{commit.commitAuthorName[0]}</AvatarFallback>
              </Avatar>
            </div>

            {/* Commit Card */}
            <div className="flex-auto rounded-lg bg-card p-4 border text-card-foreground shadow-sm">
              <div className="flex justify-between items-center gap-x-4 mb-2">
                <Link
                  href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                    <span className="font-semibold text-foreground">
                      {commit.commitAuthorName}
                    </span>
                    <span>committed</span>
                    <ExternalLink className="h-3 w-3" />
                </Link>
                
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => handleRegenerate(commit.id)}
                    disabled={isRegenerating}
                >
                    <RefreshCw 
                      className={cn(
                        "h-3 w-3 mr-1",
                        isRegenerating && "animate-spin"
                      )} 
                    />
                    {isRegenerating ? "Updating..." : "Refresh"}
                </Button>
              </div>

              <h3 className="font-semibold text-sm mb-2 break-all">
                {commit.commitMessage}
              </h3>
              
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {commit.summary || (
                  <span className="italic opacity-70">
                    No summary available
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default CommitLog;