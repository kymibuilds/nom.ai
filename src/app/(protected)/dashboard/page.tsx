"use client";

import React from "react";
import useProject from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Components
import CommitLog from "./_components/commit-log";
import AskQuestionCard from "./ask-question-card";
// Note: We import the Dashboard variant specifically
import { DashboardMeetingCard } from "./_components/meeting-card";
import ArchiveButton from "./_components/archive-button";
import InviteButton from "./_components/invite-button";
import TeamMembers from "./_components/team-members";
import DashboardHeader from "./_components/dashboard-header";

function DashboardPage() {
  const { project, loading, hasProjects } = useProject();
  const { user } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="text-muted-foreground animate-pulse">
          Loading dashboard...
        </span>
      </div>
    );
  }

  // Handle no projects state
  if (!loading && !hasProjects) {
    router.push("/create");
    return null;
  }

  return (
    <div className="space-y-8 pb-8">
      {/* 1. HEADER (Stats, Context, GitHub) */}
      <DashboardHeader />

      {/* 2. TEAM ACTIONS 
          Aligned to the right to keep the top area clean.
      */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <TeamMembers />
        <InviteButton />
        <ArchiveButton />
      </div>

      {/* 3. MAIN GRID 
          We use a wrapper div for col-spans to strictly enforce the layout 
          regardless of the component's internal classes.
      */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 items-stretch">
        
        {/* Ask Question: Takes up 3/5ths of the width */}
        <div className="lg:col-span-3">
          <AskQuestionCard />
        </div>

        {/* Meeting Upload: Takes up 2/5ths of the width */}
        <div className="lg:col-span-2 h-full">
          <DashboardMeetingCard />
        </div>
        
      </div>

      {/* 4. RECENT COMMITS */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
        <CommitLog />
      </div>
    </div>
  );
}

export default DashboardPage;