/* eslint-disable @typescript-eslint/no-unused-vars */
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
import React, { useEffect, useState, type FormEvent } from "react";
import { askQuestion } from "./actions";
import CodeReferences from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";
import { Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SiriOrb from "@/components/smoothui/siri-orb";
import { AnimatePresence, motion } from "framer-motion";

const exampleQuestions = [
  "Trace the full request lifecycle for a core API endpoint.",
  "Explain how data flows from the frontend to the database.",
  "Map out the system architecture and how modules depend on each other.",
  "Identify bottlenecks in the authentication flow.",
  "Explain how server and client components share and manage state.",
  "Detect hidden side effects in the user settings update flow.",
  "Find duplicate logic across the codebase that should be refactored.",
  "Identify inconsistent or missing error-handling patterns.",
  "Highlight performance issues caused by unnecessary re-renders.",
  "Find potential security vulnerabilities in the API layer.",
  "Locate parts of the code that could leak sensitive data.",
  "Identify database operations missing validation or sanitization.",
  "Generate an onboarding summary explaining each major module.",
  "Describe how background jobs and schedulers operate internally.",
  "Identify assumptions the project makes about environment variables.",
  "Trace code paths likely responsible for recent runtime errors.",
  "Locate functions with potential memory leaks or excessive allocations.",
  "Predict scaling issues that may occur at 10× or 100× traffic.",
  "Identify outdated or risky dependencies affecting stability.",
  "Suggest missing tests based on current feature coverage."
];

const flipVariants = {
  initial: { opacity: 0, y: 10, filter: "blur(4px)" },
  enter: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(4px)" },
};

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const saveAnswer = api.project.saveAnswer.useMutation();
  const [filesReferences, setFilesReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = useState("");
  const refetch = useRefetch();

  useEffect(() => {
    if (open || isTyping) return;
    const interval = setInterval(() => {
      setExampleIndex((i) => (i + 1) % exampleQuestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [open, isTyping]);

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
    } catch (error) {
      toast.error("Failed to generate answer");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-4xl p-0 gap-0">
          <DialogHeader className="flex shrink-0 flex-row items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <SiriOrb
                size="40px"
                colors={{
                  bg: "transparent",
                  c1: "#3b82f6",
                  c2: "#6366f1",
                  c3: "#06b6d4",
                }}
              />
              <DialogTitle className="text-lg font-semibold">Qode AI</DialogTitle>
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

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="bg-muted/30 border border-muted mb-8 rounded-xl p-4">
              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider block mb-1">You asked:</span>
              <p className="text-foreground text-sm font-medium leading-relaxed">{question}</p>
            </div>

            <div className="prose prose-sm dark:prose-invert text-foreground max-w-none">
              {answer ? (
                <ReactMarkdown>{answer}</ReactMarkdown>
              ) : (
                <div className="text-muted-foreground flex items-center gap-2 py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyzing codebase...</span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <CodeReferences filesReferences={filesReferences} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3 border-0 bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="mb-4 flex items-center gap-3 pl-1">
             <SiriOrb
                size="40px"
                colors={{
                  bg: "transparent",
                  c1: "#3b82f6",
                  c2: "#6366f1",
                  c3: "#06b6d4",
                }}
              />
            <h3 className="text-foreground text-lg font-semibold">
              Ask your codebase
            </h3>
          </div>

          <form
            onSubmit={onSubmit}
            className="group relative rounded-xl border bg-card shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 hover:border-primary/30"
          >
            {!question && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={exampleIndex}
                  variants={flipVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="text-muted-foreground/60 pointer-events-none absolute left-4 top-[14px] text-sm truncate max-w-[80%]"
                >
                  {exampleQuestions[exampleIndex]}
                </motion.div>
              </AnimatePresence>
            )}

            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              className="min-h-[48px] w-full resize-none border-0 bg-transparent px-4 py-3 pr-12 text-sm shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/0"
            />

            <Button
              type="submit"
              disabled={loading || !question.trim()}
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 shrink-0 rounded-lg bg-primary transition-all hover:bg-primary/90 disabled:opacity-50"
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