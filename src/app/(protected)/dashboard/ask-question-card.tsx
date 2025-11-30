"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import CodeReferences from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";
import { Loader2, Sparkles, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    setOpen(true);
    setAnswer("");
    setFilesReferences([]);

    try {
      const { textStream, filesReferences } = await askQuestion(
        question,
        project.id,
      );
      setFilesReferences(filesReferences);
      for await (const delta of textStream) {
        setAnswer((prev) => prev + delta);
      }
    } catch (err) {
      toast.error("Failed to generate answer");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-4xl">
          <DialogHeader className="flex shrink-0 flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              <DialogTitle>Qode AI</DialogTitle>
            </div>
            <Button
              disabled={saveAnswer.isPending || !answer}
              onClick={() => {
                saveAnswer.mutate(
                  {
                    projectId: project?.id ?? "",
                    question,
                    answer,
                    filesReferences,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Answer Saved!");
                      void refetch();
                    },
                    onError: () => toast.error("Failed to save"),
                  },
                );
              }}
              variant="outline"
              size="sm"
            >
              {saveAnswer.isPending ? "Saving..." : "Save Answer"}
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1 py-4 pr-2">
            <div className="bg-muted/50 border-muted mb-6 rounded-lg border p-3">
              <p className="text-foreground text-sm font-medium">{question}</p>
            </div>
            <div className="prose prose-sm dark:prose-invert text-foreground max-w-none">
              {answer ? (
                <ReactMarkdown>{answer}</ReactMarkdown>
              ) : (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing
                  codebase...
                </div>
              )}
            </div>
            <div className="h-6"></div>
            <CodeReferences filesReferences={filesReferences} />
          </div>
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3 border-0 bg-transparent shadow-none">
        <CardContent className="p-0">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="text-primary fill-primary/10 h-5 w-5" />
              Ask your codebase
            </h3>
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-card focus-within:ring-primary/20 hover:border-primary/30 flex items-center gap-2 rounded-xl border px-3 py-1 shadow-sm transition-all focus-within:ring-2"
          >
            {/* Slim Input */}
            <Textarea
              placeholder="e.g. How does the auth flow work?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="placeholder:text-muted-foreground/60 max-h-[100px] min-h-[50px] flex-1 resize-none border-0 bg-transparent py-3.5 text-sm shadow-none focus-visible:ring-0"
            />

            {/* Parallel Button */}
            <Button
              type="submit"
              disabled={loading || !question.trim()}
              size="icon"
              className="bg-primary hover:bg-primary/90 h-9 w-9 shrink-0 rounded-lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
