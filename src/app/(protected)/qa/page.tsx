"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import AskQuestionCard from "../dashboard/ask-question-card";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"; // Optional but recommended

function QaPage() {
  const { projectId } = useProject();
  const { data: questions } = api.project.getQuestions.useQuery({ projectId });
  const [questionIndex, setQuestionIndex] = useState(0);
  const selectedQuestion = questions?.[questionIndex];
  const [isRefreshing, setIsRefreshing] = useState(false);

  const utils = api.useUtils();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await utils.project.getQuestions.invalidate({ projectId });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Sheet>
      {/* LAYOUT FIXES:
        1. Removed outer padding (layout.tsx handles p-4)
        2. Added max-w-6xl mx-auto to center content on large screens
        3. Used flex-col gap-6 for consistent vertical rhythm
      */}
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
        
        {/* ASK CARD SECTION */}
        <div className="w-full">
          <AskQuestionCard />
        </div>

        {/* DIVIDER */}
        <div className="h-px w-full bg-border/40" />

        {/* QUESTIONS HEADER */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Saved Questions</h1>

            <Button
  variant="ghost"
  size="sm"
  onClick={handleRefresh}
  disabled={isRefreshing}
  className="h-8 gap-2 px-2 text-muted-foreground hover:text-foreground transition-colors"
>
  <RefreshCw
    className={cn(
      "h-3.5 w-3.5",
      isRefreshing && "animate-spin text-primary"
    )}
  />
  <span className="text-xs">
     {isRefreshing ? "Syncing..." : "Refresh"}
  </span>
</Button>
          </div>

          {/* QUESTIONS LIST */}
          <div className="flex flex-col gap-3">
            {questions?.length === 0 && (
              <Card className="bg-muted/20 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <p>No saved questions found.</p>
                </CardContent>
              </Card>
            )}

            {questions?.map((question, index) => (
              <React.Fragment key={question.id}>
                <SheetTrigger onClick={() => setQuestionIndex(index)} asChild>
                  <Card className="group cursor-pointer border-muted-foreground/10 bg-card hover:bg-muted/50 transition-all shadow-sm hover:shadow-md duration-200">
                    <CardHeader className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-8 w-8 rounded-lg border">
                          <AvatarImage src={question.user.imageUrl ?? ""} />
                          <AvatarFallback className="rounded-lg">U</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col flex-1 gap-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-foreground truncate text-sm sm:text-base">
                              {question.question}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                              {question.createdAt.toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground/80 transition-colors">
                            {question.answer}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </SheetTrigger>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* SHEET CONTENT (ANSWER DETAILS) */}
      {selectedQuestion && (
        <SheetContent className="sm:max-w-[80vw] w-[100vw] flex flex-col p-0 gap-0">
          <SheetHeader className="border-b px-6 py-4 bg-background z-10 sticky top-0">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border">
                        <AvatarImage src={selectedQuestion.user.imageUrl ?? ""} />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                        {selectedQuestion.createdAt.toLocaleString()}
                    </span>
                </div>
             </div>
            <SheetTitle className="text-lg sm:text-xl font-semibold leading-normal break-words">
              {selectedQuestion.question}
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 h-full">
            <div className="px-6 py-6 space-y-8 pb-20">
              {/* Answer Section */}
              <div className="prose prose-sm dark:prose-invert max-w-none w-full">
                <MDEditor.Markdown
                  source={selectedQuestion.answer}
                  className="!bg-transparent !text-foreground"
                />
              </div>

              {/* Code References Section */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">Code References</h3>
                    <Badge variant="secondary" className="text-xs">
                        {Array.isArray(selectedQuestion.filesReferences) ? (selectedQuestion.filesReferences as any[]).length : 0}
                    </Badge>
                 </div>
                
                <CodeReferences
                  filesReferences={
                    (selectedQuestion.filesReferences as {
                      fileName: string;
                      sourceCode: string;
                      summary: string;
                    }[]) ?? []
                  }
                />
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      )}
    </Sheet>
  );
}

export default QaPage;