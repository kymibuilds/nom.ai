"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/firebase";
import { Presentation, Upload, FileAudio } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Ensure styles are imported
import { api } from "@/trpc/react";
import useProject from "@/hooks/use-project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function MeetingCard() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const project = useProject();
  const router = useRouter();

  const uploadMeeting = api.project.uploadMeeting.useMutation();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
    },
    multiple: false,
    maxSize: 50_000_000, // 50MB
    onDrop: (acceptedFiles) => {
      setIsUploading(true);
      if (!acceptedFiles.length) return;

      const file = acceptedFiles[0];
      setFileName(file?.name ?? "untitled");

      const downloadURL = void uploadFile(file as File, setProgress);
      // console.log("File uploaded:", downloadURL);
      uploadMeeting.mutate({
        projectId: project.projectId,
        meetingUrl: downloadURL ?? "",
        name: file?.name ?? "untitled",
      },{
        onSuccess: () =>{
          toast.success("meeting uploading successfully")
          void router.push('/meetings')
        },
        onError: ()=>{
          toast.error("failed to upload meeting.")
        }
      })
      setIsUploading(false);
    },
  });

  return (
    <Card
      {...getRootProps()}
      className={`col-span-2 flex flex-col items-center justify-center border transition-all duration-200 cursor-pointer 
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50/50"
            : "border-gray-200 hover:border-blue-500/50 hover:bg-gray-50/50"
        }`}
    >
      <Input className="hidden" {...getInputProps()} />
      
      {!isUploading ? (
        <>
          <div className="rounded-full bg-blue-100/80 p-4 mb-5 shadow-sm">
            <Presentation className="h-8 w-8 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900">
            Create a new meeting
          </h3>
          
          <p className="mt-2 text-center text-sm text-gray-500 max-w-xs">
            Analyze your meeting with Qode.
            <br />
            <span className="text-xs text-gray-400">Powered by AI</span>
          </p>

          <div className="mt-8">
            <Button 
                disabled={isUploading} 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Meeting
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center w-full max-w-[200px]">
          <div className="size-24 drop-shadow-sm">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                pathColor: "#2563eb",
                textColor: "#2563eb",
                trailColor: "#e5e7eb",
                pathTransitionDuration: 0.5,
                textSize: '22px'
              })}
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-900">
             <FileAudio className="h-4 w-4 text-blue-500" />
             <span className="truncate max-w-[150px]">{fileName}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500 animate-pulse">
            Uploading & Processing...
          </p>
        </div>
      )}
    </Card>
  );
}

export default MeetingCard;