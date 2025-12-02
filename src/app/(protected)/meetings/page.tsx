"use client";

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import React from "react";
import { MeetingCard } from "../dashboard/_components/meeting-card"; // Named import
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar, Trash2, ArrowRight, Loader2, FileAudio } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Fallback loader in case BouncingDots isn't available, though keeping user's import preference if the file existed.
// Replacing with standard standard shadcn/lucide loader for safety in this generation to ensure it runs without missing component errors.
// If you have BouncingDots, feel free to revert the loader section.

function MeetingsPage() {
  const { projectId } = useProject();

  const {
    data: meetings,
    isLoading,
    refetch,
  } = api.project.getMeetings.useQuery(
    { projectId },
    { refetchInterval: 10000 },
  );

  const deleteMeeting = api.project.deleteMeeting.useMutation({
    onSuccess: () => {
      toast.success("Meeting deleted successfully");
      void refetch();
    },
    onError: () => {
      toast.error("Failed to delete meeting");
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Upload and manage your meeting audio files for AI analysis.
          </p>
        </div>
      </div>

      {/* Upload Area - Wrapped to give it height since MeetingCard uses h-full */}
      <div className="h-64 w-full md:h-96">
        <MeetingCard />
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-lg leading-none font-semibold tracking-tight">
          Recent Uploads
        </h2>

        {isLoading ? (
          <div className="text-muted-foreground flex h-60 items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>Loading meetings...</span>
          </div>
        ) : !meetings || meetings.length === 0 ? (
          <div className="bg-muted/30 flex h-60 flex-col items-center justify-center rounded-xl border border-dashed">
            <div className="bg-muted/50 flex h-12 w-12 items-center justify-center rounded-full">
              <FileAudio className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-muted-foreground mt-3 text-sm font-medium">
              No meetings found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="group bg-card relative flex flex-col justify-between rounded-xl border p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="bg-primary/10 rounded-md p-2">
                      <FileAudio className="text-primary h-5 w-5" />
                    </div>
                    {meeting.status === "PROCESSING" && (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
                      >
                        Processing...
                        <Loader2 className="ml-1 h-3 w-3 animate-spin" />
                      </Badge>
                    )}
                    {meeting.status === "COMPLETED" && (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-600"
                      >
                        Ready
                      </Badge>
                    )}
                  </div>

                  <div>
                    <Link
                      href={`/meetings/${meeting.id}`}
                      className="text-foreground decoration-primary/50 line-clamp-1 font-semibold underline-offset-4 hover:underline"
                      title={meeting.name}
                    >
                      {meeting.name}
                    </Link>
                    <div className="text-muted-foreground mt-1 flex items-center text-xs">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(
                        new Date(meeting.createdAt),
                        "dd MMM yyyy • h:mm a",
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        disabled={deleteMeeting.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the meeting <b>{meeting.name}</b> and remove
                          all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            deleteMeeting.mutate({ meetingId: meeting.id })
                          }
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleteMeeting.isPending
                            ? "Deleting..."
                            : "Delete Meeting"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Link href={`/meetings/${meeting.id}`}>
                    <Button size="sm" variant="outline" className="gap-2">
                      View Summary
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetingsPage;
