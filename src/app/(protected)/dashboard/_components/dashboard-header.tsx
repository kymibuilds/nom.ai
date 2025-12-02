"use client";

import Link from "next/link";
import { ExternalLink, Github, Users, GitCommit, CalendarDays, Bug, Activity, ArrowUpRight, BellDot, Bell } from "lucide-react";
import useProject from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardHeader() {
  const { project } = useProject();
  const { user } = useUser();

  const { data: stats } = api.project.getDashboardStats.useQuery(
    { projectId: project?.id ?? "" },
    { enabled: !!project?.id }
  );

  return (
    <div className="space-y-4 mb-6">
      {/* 1. TOP BAR: Title & Primary Actions */}
      <div className="flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Dashboard</h1>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground font-medium">{project?.name}</span>
           </div>
           <p className="text-xs text-muted-foreground mt-1">
             Overview for {user?.firstName}
           </p>
        </div>

        <div className="flex gap-2 items-center justify-center">
            <Button className="border border-input" size={"icon-sm"} variant={"ghost"}>
                <Bell className="text-base hover:text-foreground cursor-pointer h-5 w-5" />
            </Button>

            {project?.githubUrl && (
            <Button asChild variant="outline" size="sm" className="h-8 rounded-md gap-2 text-xs border-dashed hover:border-solid hover:bg-muted/30">
              <Link href={project.githubUrl} target="_blank">
                <Github className="size-3.5" />
                Linked Repository
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* 2. STATS GRID: Sharper, minimal, informative */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Team Members"
          value={stats?.teamCount}
          icon={Users}
          meta="Active users"
        />
        <StatCard
          label="Commits"
          value={stats?.commitCount}
          icon={GitCommit}
          meta="Total history"
        />
        <StatCard
          label="Meetings"
          value={stats?.meetingCount}
          icon={CalendarDays}
          meta="Scheduled"
        />
        <StatCard
          label="Issues"
          value={stats?.issueCount}
          icon={Bug}
          meta="Extracted"
        />
      </div>

      {/* 3. INFO BAR: Technical details at a glance */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground rounded-md border bg-muted/20 p-2 px-3">
         <div className="flex items-center gap-1.5">
            <Activity className="size-3.5 text-primary" />
            <span>Last Activity:</span>
            <span className="font-mono text-foreground">
               {stats?.lastActivity 
                  ? new Date(stats.lastActivity).toLocaleString() 
                  : "No activity recorded"}
            </span>
         </div>
         <div className="h-3 w-px bg-border" />
         <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Project Status: Active</span>
         </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  meta
}: {
  label: string;
  value: number | undefined;
  icon: any;
  meta: string;
}) {
  return (
    <div className="group flex flex-col justify-between rounded-md border bg-card p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
         <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {label}
         </span>
         <Icon className="size-3.5 text-muted-foreground/70" />
      </div>
      
      <div>
        <div className="text-2xl font-bold tabular-nums text-foreground">
            {value ?? 0}
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5 lowercase">
            {meta}
        </div>
      </div>
    </div>
  );
}