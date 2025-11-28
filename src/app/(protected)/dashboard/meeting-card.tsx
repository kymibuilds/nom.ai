"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/firebase";
import { Presentation, Upload, FileAudio } from "lucide-react";
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

function MeetingCard() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const project = useProject();
  const router = useRouter();

  // PROCESS MEETING (client → API route)
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

  // UPLOAD MEETING (tRPC)
  const uploadMeeting = api.project.uploadMeeting.useMutation();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "audio/*": [".mp3", ".wav", ".m4a"] },
    multiple: false,
    maxSize: 50_000_000,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      setIsUploading(true);

      const file = acceptedFiles[0];
      setFileName(file?.name ?? "untitled");

      // WAIT for Firebase upload — DO NOT use void
      const downloadURL = await uploadFile(file as File, setProgress);

      uploadMeeting.mutate(
        {
          projectId: project.projectId,
          meetingUrl: downloadURL,
          name: file?.name ?? "error",
        },
        {
          onSuccess:  (data) => {
            const meetingId = data.id;

            toast.success("Meeting uploaded successfully");

            // Now process the meeting (AI summaries)
            void processMeeting.mutateAsync({
              meetingUrl: downloadURL,
              meetingId,
              projectId: project.projectId,
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
    },
  });

  return (
    <Card
      {...getRootProps()}
      className={`col-span-2 flex cursor-pointer flex-col items-center justify-center border transition-all duration-200 ${
        isDragActive
          ? "border-blue-500 bg-blue-50/50"
          : "border-gray-200 hover:border-blue-500/50 hover:bg-gray-50/50"
      }`}
    >
      <Input className="hidden" {...getInputProps()} />

      {!isUploading ? (
        <>
          <div className="mb-5 rounded-full bg-blue-100/80 p-4 shadow-sm">
            <Presentation className="h-8 w-8 text-blue-600" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            Create a new meeting
          </h3>

          <p className="mt-2 max-w-xs text-center text-sm text-gray-500">
            Analyze your meeting with Qode.
            <br />
            <span className="text-xs text-gray-400">Powered by AI</span>
          </p>

          <div className="mt-8">
            <Button
              disabled={isUploading}
              className="bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Meeting
            </Button>
          </div>
        </>
      ) : (
        <div className="flex w-full max-w-[200px] flex-col items-center">
          <div className="size-24 drop-shadow-sm">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                pathColor: "#2563eb",
                textColor: "#2563eb",
                trailColor: "#e5e7eb",
                pathTransitionDuration: 0.5,
                textSize: "22px",
              })}
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-900">
            <FileAudio className="h-4 w-4 text-blue-500" />
            <span className="max-w-[150px] truncate">{fileName}</span>
          </div>
          <p className="mt-1 animate-pulse text-xs text-gray-500">
            Uploading & Processing...
          </p>
        </div>
      )}
    </Card>
  );
}

export default MeetingCard;
