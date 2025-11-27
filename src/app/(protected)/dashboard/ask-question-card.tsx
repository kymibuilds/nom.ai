"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import React, { useState, type FormEvent } from "react";
import { askQuestion } from "./actions";
// import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";

const AskQuestionCard = () => {
  const { project } = useProject();

  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const saveAnswer = api.project.saveAnswer.useMutation();

  const [filesReferences, setFilesReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);

  const [answer, setAnswer] = useState("");
  const refetch = useRefetch();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setAnswer("");
    setFilesReferences([]);
    e.preventDefault();
    if (!project?.id) return;

    setLoading(true);
    setOpen(true);
    setAnswer("");
    setFilesReferences([]);

    const { textStream, filesReferences } = await askQuestion(
      question,
      project.id,
    );

    setFilesReferences(filesReferences);

    for await (const delta of textStream) {
      setAnswer((prev) => prev + delta);
    }

    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80vw]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>{question}</DialogTitle>
              <Button disabled={saveAnswer.isPending} variant={"outline"} onClick={()=>{
                saveAnswer.mutate({
                  projectId: project?.id ?? "",
                  question,answer, filesReferences
                },{
                  onSuccess: ()=>{
                    toast.success('Answer Saved!')
                    void refetch();
                  },
                  onError: () => {
                    toast.error("Failed to save Answer!")
                  }
                })
              }}>save answer</Button>
            </div>
            
          </DialogHeader>

          <div className="mt-4 text-sm whitespace-pre-wrap">
            {/*<MDEditor.Markdown source={answer || "thinking..."}  className="max-w-[70vw] h-full! max-h-[40vh] overflow-scroll"/>*/}
            <div className="max-w-[70vw] h-full! max-h-[40vh] overflow-scroll">{answer|| "thinking..."}</div>
            <div className="h-4"></div>
            <CodeReferences filesReferences={filesReferences}/>
            
            <Button type="button" onClick={()=>{setOpen(false)}}>close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="Which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <div className="h-4"></div>

            <Button type="submit" disabled={loading}>
              {loading ? "Thinking..." : "Ask Qode!"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
