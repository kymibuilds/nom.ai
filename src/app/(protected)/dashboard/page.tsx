"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import useProject from "@/hooks/use-project";

import CommitLog from "./_components/commit-log";
import AskQuestionCard from "./ask-question-card";
import MeetingCard from "./_components/meeting-card";
import ArchiveButton from "./_components/archive-button";
import InviteButton from "./_components/invite-button";
import TeamMembers from "./_components/team-members";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// NEW
import DashboardHeader from "./_components/dashboard-header";

function DashboardPage() {
  const { project, loading, hasProjects } = useProject();
  const { user } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading...
      </div>
    );
  }

  if (!loading && !hasProjects) router.push("/create-project");

  return (
    <div className="space-y-8">

      {/* NEW HEADER */}
      <DashboardHeader />

      {/* TOP HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-end gap-4">
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
        <h1 className="text-lg font-semibold mb-4">Most Recent Commits</h1>
        <CommitLog />
      </div>
    </div>
  );
}

export default DashboardPage;
