"use client";

import React from "react";
import useProject from "@/hooks/use-project";
import { useRouter } from "next/navigation";

import CommitLog from "./_components/commit-log";
import AskQuestionCard from "./ask-question-card";
import { DashboardMeetingCard } from "./_components/meeting-card";
import ArchiveButton from "./_components/archive-button";
import InviteButton from "./_components/invite-button";
import TeamMembers from "./_components/team-members";
import DashboardHeader from "./_components/dashboard-header";

export default function DashboardPage() {
  const { loading, hasProjects } = useProject();
  const router = useRouter();

  // Never render dashboard until hydrated + loaded → prevents flicker
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="text-muted-foreground animate-pulse">
          Loading dashboard...
        </span>
      </div>
    );
  }

  // After hydration: safe redirect if user truly has no projects
  if (!hasProjects) {
    router.push("/create");
    return null;
  }

  return (
    <div className="space-y-8 pb-8">
      <DashboardHeader />

      <div className="flex flex-wrap items-center justify-end gap-3">
        <TeamMembers />
        <InviteButton />
        <ArchiveButton />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 items-stretch">
        <div className="lg:col-span-3">
          <AskQuestionCard />
        </div>

        <div className="lg:col-span-2 h-full">
          <DashboardMeetingCard />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Recent Activity
        </h2>
        <CommitLog />
      </div>
    </div>
  );
}
