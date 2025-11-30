"use client";

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import React from "react";
import MeetingCard from "../dashboard/meeting-card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  Calendar, 
  Trash2, 
  ArrowRight, 
  Loader2, 
  FileAudio 
} from "lucide-react";
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
import { BouncingDots } from "@/components/molecule-ui/bouncing-dots";

function MeetingsPage() {
  const { projectId } = useProject();
  
  const { data: meetings, isLoading, refetch } = api.project.getMeetings.useQuery(
    { projectId },
    { refetchInterval: 10000 }
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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Upload and manage your meeting audio files for AI analysis.
          </p>
        </div>
      </div>

      <MeetingCard />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          Recent Uploads
        </h2>

        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
             <BouncingDots message='Loading meetings...' messagePlacement='bottom' dots={3}/>
          </div>
        ) : !meetings || meetings.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
              <FileAudio className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              No meetings found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="group relative flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="rounded-md bg-primary/10 p-2">
                      <FileAudio className="h-5 w-5 text-primary" />
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
                  </div>

                  <div>
                    <Link
                      href={`/meetings/${meeting.id}`}
                      className="font-semibold text-foreground hover:underline decoration-primary/50 underline-offset-4"
                    >
                      {meeting.name}
                    </Link>
                    <div className="mt-1 flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(new Date(meeting.createdAt), "dd MMM yyyy • h:mm a")}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        disabled={deleteMeeting.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete 
                          the meeting <b>{meeting.name}</b> and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMeeting.mutate({ meetingId: meeting.id })}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleteMeeting.isPending ? "Deleting..." : "Delete Meeting"}
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