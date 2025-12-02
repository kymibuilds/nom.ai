"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import useProject from "@/hooks/use-project";

import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import MeetingCard from "./meeting-card";
import ArchiveButton from "./archive-button";
import InviteButton from "./invite-button";
import TeamMembers from "./team-members";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function DashboardPage() {
  const { project, loading, hasProjects } = useProject();
  const { user } = useUser();
  const router = useRouter();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!loading && !hasProjects) router.push("/create-project");

  return (
    <div className="space-y-8">
    <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <div>
            <h2 className="text-lg font-medium">Welcome back, {user?.firstName || 'User'}</h2>
            <p className="text-muted-foreground text-sm">Track team progress here, you're almost at your goal!</p>
        </div>
    </div>
      {/* TOP HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Github Link Badge */}
        <div className="w-fit rounded-md bg-primary px-4 py-2 flex items-center shadow-sm transition-all hover:opacity-90">
          <Github className="size-5 text-primary-foreground mr-2" />
          <div className="text-sm font-medium text-primary-foreground">
            This project is linked to{" "}
            <Link
              href={project?.githubUrl ?? ""}
              className="inline-flex items-center font-bold underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all"
              target="_blank"
            >
              {project?.githubUrl}
              <ExternalLink className="ml-1 size-4" />
            </Link>
          </div>
        </div>

        {/* Team Actions */}
        <div className="flex items-center gap-2">
          <TeamMembers /> 
          <InviteButton /> 
          <ArchiveButton />
        </div>
      </div>

      {/* ACTION GRID */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 items-start">
        {/* Ask Question takes up 3/5 columns */}
        <AskQuestionCard />
        
        {/* Meeting Card takes up 2/5 columns */}
        <MeetingCard />
      </div>

      {/* COMMIT LOG SECTION */}
      <div className="mt-8">
        <CommitLog />
      </div>
    </div>
  );
}

export default DashboardPage;