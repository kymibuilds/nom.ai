"use client";

import React, { useState } from "react";
import { api, type RouterOutputs } from "@/trpc/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";

type Props = {
  meetingId: string;
};

type IssueType = NonNullable<
  RouterOutputs["project"]["getMeetingById"]
>["issues"][number];

function IssuesList({ meetingId }: Props) {
  const { data: meeting, isLoading } = api.project.getMeetingById.useQuery(
    { meetingId },
    { refetchInterval: 4000 },
  );

  // Handle null + loading
  if (isLoading || !meeting) return <div>Loading...</div>;

  const safeMeeting = meeting;

  return (
    <div className="p-8">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b pb-6 lg:mx-0 lg:max-w-none">
        <div className="flex items-center gap-x-6">
          <div className="rounded-full border bg-white p-3">
            <VideoIcon className="h-6 w-6" />
          </div>

          <h1>
            <div className="text-sm text-gray-600">
              Meeting on {safeMeeting.createdAt.toLocaleDateString()}
            </div>

            <div className="mt-1 text-base font-semibold text-gray-900">
              {safeMeeting.name}
            </div>
          </h1>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {safeMeeting.issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}

function IssueCard({ issue }: { issue: IssueType }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{issue.gist}</DialogTitle>
            {issue.headline && (
              <DialogDescription>{issue.headline}</DialogDescription>
            )}
          </DialogHeader>
          <p className="mt-2 text-sm text-gray-700">{issue.summary}</p>
        </DialogContent>
      </Dialog>

      {/* Card */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{issue.gist}</CardTitle>
          {issue.headline && (
            <CardDescription>{issue.headline}</CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
            Details
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default IssuesList;
