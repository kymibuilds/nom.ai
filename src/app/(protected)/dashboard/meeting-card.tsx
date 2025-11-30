"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/firebase";
import { Presentation, Upload, FileAudio, CheckCircle2 } from "lucide-react";
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

function MeetingCard() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const { project } = useProject();
  const router = useRouter();

  const processMeeting = useMutation({
    mutationFn: async ({
      meetingUrl,
      meetingId,
      projectId,
    }: {
      meetingUrl: string;
      meetingId: string;
      projectId: string;
    }) => {
      const response = await axios.post("/api/process-meeting", {
        meetingUrl,
        meetingId,
        projectId,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Meeting processed successfully");
    },
    onError: () => {
      toast.error("Failed to process meeting");
    },
  });

  const uploadMeeting = api.project.uploadMeeting.useMutation();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "audio/*": [".mp3", ".wav", ".m4a"] },
    multiple: false,
    maxSize: 50_000_000,
    onDrop: (acceptedFiles) => {
      void (async () => {
        if (!acceptedFiles.length) return;
        if (!project) return;

        setIsUploading(true);

        const file = acceptedFiles[0];
        setFileName(file?.name ?? "untitled");

        const downloadURL = await uploadFile(file as File, setProgress);

        uploadMeeting.mutate(
          {
            projectId: project.id,
            meetingUrl: downloadURL,
            name: file?.name ?? "error",
          },
          {
            onSuccess: (data) => {
              const meetingId = data.id;
              toast.success("Meeting uploaded successfully");
              void processMeeting.mutateAsync({
                meetingUrl: downloadURL,
                meetingId,
                projectId: project.id,
              });
              router.push("/meetings");
            },
            onError: () => {
              toast.error("Failed to upload meeting.");
            },
            onSettled: () => {
              setIsUploading(false);
            },
          }
        );
      })();
    },
  });

  return (
    <Card
      className="col-span-2 flex h-full flex-col items-center justify-center overflow-hidden p-0"
    >
      <div
        {...getRootProps()}
        className={`relative flex h-full w-full cursor-pointer flex-col items-center justify-center bg-card p-6 transition-all duration-300 ${
          isDragActive
            ? "bg-primary/5 ring-2 ring-primary ring-inset"
            : "hover:bg-muted/50"
        }`}
      >
        <Input className="hidden" {...getInputProps()} />

        <AnimatePresence mode="wait">
          {!isUploading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center text-center"
            >
              {/* Animated Icon Container */}
              <div className="bg-background relative mb-6 rounded-full p-4 shadow-sm ring-1 ring-border">
                {isDragActive ? (
                   <Upload className="text-primary size-8 animate-bounce" />
                ) : (
                   <Presentation className="text-muted-foreground size-8" />
                )}
                
                {/* Decorative background blob */}
                <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/10 blur-xl" />
              </div>

              <h3 className="font-semibold text-lg text-foreground">
                {isDragActive ? "Drop the file here" : "Create a new meeting"}
              </h3>

              <p className="text-muted-foreground mt-2 max-w-[280px] text-sm">
                {isDragActive ? (
                  <span className="text-primary">Release to upload</span>
                ) : (
                  "Upload audio to generate summaries and add context to your codebase."
                )}
              </p>

              <Button
                variant="outline"
                disabled={isUploading}
                className="mt-6 pointer-events-none" // pointer-events-none because the parent div handles the click
              >
                <Upload className="-ml-0.5 mr-2 size-4" />
                Upload Meeting
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full max-w-[200px] flex-col items-center justify-center"
            >
              <div className="relative size-28">
                <CircularProgressbar
                  value={progress}
                  text={`${progress}%`}
                  styles={buildStyles({
                    pathColor: "#2563eb", // Primary blue
                    textColor: "currentColor",
                    trailColor: "hsl(var(--muted))",
                    textSize: "20px",
                    pathTransitionDuration: 0.5,
                  })}
                  className="text-foreground font-semibold"
                />
                
                {progress === 100 && (
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-card rounded-full"
                    >
                        <CheckCircle2 className="size-10 text-green-500" />
                    </motion.div>
                )}
              </div>
              
              <div className="mt-4 flex flex-col items-center gap-1 text-center">
                <span className="text-sm font-medium text-foreground line-clamp-1 max-w-[180px]">
                  {fileName}
                </span>
                <p className="text-xs text-muted-foreground animate-pulse">
                  {progress < 100 ? "Uploading to secure storage..." : "Processing audio..."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

export default MeetingCard;