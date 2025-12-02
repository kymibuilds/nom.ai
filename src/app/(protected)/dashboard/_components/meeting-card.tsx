"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress"; // Ensure you have this shadcn component
import { uploadFile } from "@/lib/firebase";
import { Presentation, Upload, CheckCircle2, Plus, FileAudio } from "lucide-react";
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
 * Handles file drop, firebase upload, and backend processing.
 */
function useMeetingUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const { project } = useProject();
  const router = useRouter();

  const processMeeting = useMutation({
    mutationFn: async (data: { meetingUrl: string; meetingId: string; projectId: string }) => {
      const response = await axios.post("/api/process-meeting", data);
      return response.data;
    },
    onSuccess: () => toast.success("Meeting processed successfully"),
    onError: () => toast.error("Failed to process meeting"),
  });

  const uploadMeeting = api.project.uploadMeeting.useMutation();

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length || !project) return;
    
    setIsUploading(true);
    const file = acceptedFiles[0];
    setFileName(file?.name ?? "untitled");

    try {
      const downloadURL = await uploadFile(file!, setProgress);
      
      uploadMeeting.mutate(
        { projectId: project.id, meetingUrl: downloadURL, name: file?.name ?? "untitled" },
        {
          onSuccess: (data) => {
            toast.success("Upload complete!");
            processMeeting.mutateAsync({
                meetingUrl: downloadURL, 
                meetingId: data.id, 
                projectId: project.id
            });
            router.push("/meetings");
          },
          onError: () => toast.error("Failed to upload meeting."),
          onSettled: () => setIsUploading(false),
        }
      );
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      toast.error("Upload failed");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "audio/*": [".mp3", ".wav", ".m4a"] },
    multiple: false,
    maxSize: 50_000_000, // 50MB
    onDrop,
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

/* ==================================================================================
   1. DASHBOARD VARIANT (Compact)
   - Minimalist, fits in small grids
   - Uses linear progress bar
   ================================================================================== */
export const DashboardMeetingCard = () => {
  const { isUploading, progress, getRootProps, getInputProps, isDragActive } = useMeetingUpload();

  return (
    <Card className="col-span-1 flex flex-col items-center justify-center overflow-hidden h-full rounded-xl bg-card border hover:border-primary/50 transition-all cursor-pointer">
      <div
        {...getRootProps()}
        className={cn(
            "relative flex h-full w-full flex-col items-center justify-center p-6 text-center transition-all",
            isDragActive && "bg-primary/5 ring-2 ring-inset ring-primary"
        )}
      >
        <Input className="hidden" {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {!isUploading ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="rounded-full bg-primary/10 p-3 ring-1 ring-primary/20">
                <Upload className="size-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">Upload Meeting</p>
                <p className="text-xs text-muted-foreground">Drop audio or click</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full space-y-3 px-2"
            >
               <div className="flex items-center justify-center gap-2 text-xs font-medium text-primary animate-pulse">
                  <FileAudio className="size-4" />
                  Uploading...
               </div>
               <Progress value={progress} className="h-2 w-full" />
               <p className="text-[10px] text-muted-foreground text-center">{progress}% completed</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

/* ==================================================================================
   2. MEETINGS PAGE VARIANT (Full)
   - Large, detailed, circular progress
   - Acts as a page centerpiece
   ================================================================================== */
export const MeetingCard = () => {
  const { isUploading, progress, fileName, getRootProps, getInputProps, isDragActive } = useMeetingUpload();

  return (
    <Card className="col-span-2 flex h-full flex-col items-center justify-center overflow-hidden p-0 rounded-2xl border-dashed border-2 shadow-none hover:border-primary/50 transition-colors">
      <div
        {...getRootProps()}
        className={cn(
            "relative flex h-full w-full cursor-pointer flex-col items-center justify-center bg-transparent p-10 transition-all duration-300",
            isDragActive ? "bg-primary/5" : "hover:bg-muted/30"
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
              <div className="bg-background relative mb-6 rounded-full p-5 shadow-sm ring-1 ring-border group-hover:ring-primary/40 transition-all">
                {isDragActive ? (
                   <Upload className="text-primary size-10 animate-bounce" />
                ) : (
                   <Presentation className="text-muted-foreground size-10 group-hover:text-primary transition-colors" />
                )}
                <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/5 blur-xl" />
              </div>

              <h3 className="font-bold text-xl text-foreground">
                {isDragActive ? "Drop the file here" : "Create a new meeting"}
              </h3>

              <p className="text-muted-foreground mt-3 max-w-[320px] text-sm leading-relaxed">
                {isDragActive ? (
                  <span className="text-primary font-medium">Release to upload</span>
                ) : (
                  "Analyze your audio to generate summaries, code references, and insights."
                )}
              </p>

              <Button variant="outline" disabled={isUploading} className="mt-8 pointer-events-none shadow-sm">
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
                    trailColor: "hsl(var(--muted))", // matches shadcn muted
                    textSize: "18px",
                    pathTransitionDuration: 0.5,
                  })}
                  className="text-foreground font-bold"
                />
                
                {progress === 100 && (
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-card rounded-full shadow-lg border"
                    >
                        <CheckCircle2 className="size-12 text-green-500" />
                    </motion.div>
                )}
              </div>
              
              <div className="mt-6 flex flex-col items-center gap-1.5 text-center">
                <span className="text-sm font-semibold text-foreground line-clamp-1 max-w-[200px]">
                  {fileName}
                </span>
                <p className="text-xs text-muted-foreground/80 animate-pulse uppercase tracking-wide">
                  {progress < 100 ? "Uploading securely..." : "Processing audio..."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};