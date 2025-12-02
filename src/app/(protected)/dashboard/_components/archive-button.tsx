"use client";

import { Button } from "@/components/ui/button";
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
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { Loader2, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function ArchiveButton() {
  const archiveProject = api.project.archiveProject.useMutation();
  const { projectId } = useProject();
  const refetch = useRefetch();

  const handleArchive = () => {
    archiveProject.mutate(
      { projectId },
      {
        onSuccess: () => {
          toast.success("Project archived");
          void refetch();
        },
        onError: () => {
          toast.error("Failed to archive project");
        },
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          disabled={archiveProject.isPending}
          className="h-9"
        >
           {archiveProject.isPending ? (
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
           ) : (
             <Trash2 className="mr-2 h-4 w-4" />
           )}
           Archive
        </Button>
      </AlertDialogTrigger>
      
      {/* ADDED: sm:max-w-md to match the Invite Dialog width */}
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will archive your project and
            remove it from your active dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleArchive}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, archive it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ArchiveButton;