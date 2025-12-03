"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { uploadFile } from "@/lib/firebase";
import { Presentation, Upload, CheckCircle2, FileAudio } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { api } from "@/trpc/react";
import useProject from "@/hooks/use-project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * SHARED LOGIC HOOK
 */
function useMeetingUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const { project } = useProject();
  const router = useRouter();

//   Progress callback for the upload
//   const handleProgressUpdate = (progress: number) => {
//     setProgress(progress);
//   };

  const processMeeting = useMutation({
    mutationFn: async (data: {
      meetingUrl: string;
      meetingId: string;
      projectId: string;
    }) => {
      return (await axios.post("/api/process-meeting", data)).data;
    },
    onSuccess: () => toast.success("Meeting processed successfully"),
    onError: () => toast.error("Failed to process meeting"),
  });

  const uploadMeeting = api.project.uploadMeeting.useMutation();

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length || !project) return;

    setIsUploading(true);
    const file = acceptedFiles[0];
    if (!(file instanceof File)) return;
    setFileName(file.name || "untitled");

    try {
      const downloadURL = await uploadFile(file, setProgress);

      uploadMeeting.mutate(
        {
          projectId: project.id,
          meetingUrl: downloadURL,
          name: file?.name ?? "untitled",
        },
        {
          onSuccess: (data) => {
            toast.success("Upload complete!");
            void processMeeting.mutateAsync({
              meetingUrl: downloadURL,
              meetingId: data.id,
              projectId: project.id,
            });
            router.push("/meetings");
          },
          onError: () => toast.error("Failed to upload meeting."),
          onSettled: () => setIsUploading(false),
        },
      );
    } catch {
      setIsUploading(false);
      toast.error("Upload failed");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "audio/*": [".mp3", ".wav", ".m4a"] },
    multiple: false,
    maxSize: 50_000_000,
    onDrop: (acceptedFiles) => {
      void onDrop(acceptedFiles);
    },
  });

  return {
    isUploading,
    progress,
    fileName,
    getRootProps,
    getInputProps,
    isDragActive,
  };
}

/* DASHBOARD VARIANT */
export const DashboardMeetingCard = () => {
  const { isUploading, progress, getRootProps, getInputProps, isDragActive } =
    useMeetingUpload();

  return (
    <Card className="bg-card hover:border-primary/50 col-span-1 flex h-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border transition-all">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex h-full w-full flex-col items-center justify-center p-6 text-center transition-all",
          isDragActive && "bg-primary/5 ring-primary ring-2 ring-inset",
        )}
      >
        <Input className="hidden" {...getInputProps()} />

        <AnimatePresence mode="wait">
          {!isUploading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="bg-primary/10 ring-primary/20 rounded-full p-3 ring-1">
                <Upload className="text-primary size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Upload Meeting</p>
                <p className="text-muted-foreground text-xs">
                  Drop audio or click
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full space-y-3 px-2"
            >
              <div className="text-primary flex animate-pulse items-center justify-center gap-2 text-xs font-medium">
                <FileAudio className="size-4" />
                Uploading...
              </div>
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-muted-foreground text-center text-[10px]">
                {progress}% completed
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

/* MEETINGS PAGE VARIANT */
export const MeetingCard = () => {
  const {
    isUploading,
    progress,
    fileName,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useMeetingUpload();

  return (
    <Card className="hover:border-primary/50 col-span-2 flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-0 shadow-none transition-colors">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex h-full w-full cursor-pointer flex-col items-center justify-center bg-transparent p-10 transition-all duration-300",
          isDragActive ? "bg-primary/5" : "hover:bg-muted/30",
        )}
      >
        <Input className="hidden" {...getInputProps()} />

        <AnimatePresence mode="wait">
          {!isUploading ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="bg-background ring-border group-hover:ring-primary/40 relative mb-6 rounded-full p-5 shadow-sm ring-1 transition-all">
                {isDragActive ? (
                  <Upload className="text-primary size-10 animate-bounce" />
                ) : (
                  <Presentation className="text-muted-foreground group-hover:text-primary size-10 transition-colors" />
                )}
                <div className="bg-primary/5 absolute inset-0 -z-10 animate-pulse rounded-full blur-xl" />
              </div>

              <h3 className="text-foreground text-xl font-bold">
                {isDragActive ? "Drop the file here" : "Create a new meeting"}
              </h3>

              <p className="text-muted-foreground mt-3 max-w-[320px] text-sm leading-relaxed">
                {isDragActive ? (
                  <span className="text-primary font-medium">
                    Release to upload
                  </span>
                ) : (
                  "Analyze your audio to generate summaries, code references, and insights."
                )}
              </p>

              <Button
                variant="outline"
                disabled={isUploading}
                className="pointer-events-none mt-8 shadow-sm"
              >
                <Upload className="mr-2 size-4" />
                Select Audio File
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex w-full max-w-[220px] flex-col items-center justify-center"
            >
              <div className="relative size-32">
                <CircularProgressbar
                  value={progress}
                  text={`${progress}%`}
                  styles={buildStyles({
                    pathColor: "#2563eb",
                    textColor: "currentColor",
                    trailColor: "hsl(var(--muted))",
                    textSize: "18px",
                    pathTransitionDuration: 0.5,
                  })}
                  className="text-foreground font-bold"
                />

                {progress === 100 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-card absolute inset-0 flex items-center justify-center rounded-full border shadow-lg"
                  >
                    <CheckCircle2 className="size-12 text-green-500" />
                  </motion.div>
                )}
              </div>

              <div className="mt-6 flex flex-col items-center gap-1.5 text-center">
                <span className="text-foreground line-clamp-1 max-w-[200px] text-sm font-semibold">
                  {fileName}
                </span>

                <p className="text-muted-foreground/80 animate-pulse text-xs tracking-wide uppercase">
                  {progress < 100
                    ? "Uploading securely..."
                    : "Processing audio..."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
