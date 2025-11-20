"use client";

import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function CommitLog() {
  const { projectId, project } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });
  return (
    <>
      <ul className="space-y-6">
        {commits?.map((commit, commitIndex) => {
          return (
            <li key={commit.id} className="relative flex gap-x-4">
              <div
                className={cn(
                  commitIndex === commits.length - 1 ? "h-6" : "-bottom-6",
                  "absolute top-0 left-0 flex w-6 justify-center",
                )}
              >
                <div className="w-px translate-x-1 bg-gray-200"></div>
              </div>

              {/* Avatar */}
              <div className="mt-1.5 flex-none">
                <Image
                  src={commit.commitAuthorAvatar}
                  alt="author avatar"
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full bg-white ring-1 ring-gray-200"
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
                </div>

                <span className="font-semibold">{commit.commitMessage}</span>
                <pre className="mt-2 text-sm leading-6 whitespace-pre-wrap text-gray-500">
                  {commit.summary}
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
