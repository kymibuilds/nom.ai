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
      <div className="p-6 space-y-8">
        {/* TOP SECTION: ASK CARD */}
        <div className="mx-auto max-w-4xl">
          <AskQuestionCard />
        </div>

        <div className="h-px bg-border" />

        {/* QUESTIONS LIST SECTION */}
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Saved Questions</h1>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <div className="grid gap-4">
            {questions?.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No saved questions yet.
              </div>
            )}
            
            {questions?.map((question, index) => (
              <React.Fragment key={question.id}>
                <SheetTrigger onClick={() => setQuestionIndex(index)} asChild>
                  <Card className="cursor-pointer transition-all hover:bg-muted/50 hover:shadow-md border-muted-foreground/10">
                    <div className="p-4 flex items-start gap-4">
                      <Avatar className="h-8 w-8 mt-1 border">
                        <AvatarImage src={question.user.imageUrl ?? ""} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-foreground line-clamp-1 text-base">
                            {question.question}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                            {question.createdAt.toLocaleDateString(undefined, {
                                month: 'short', 
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            })}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {/* Strip markdown symbols for preview if possible, otherwise just show raw */}
                          {question.answer}
                        </p>
                      </div>
                    </div>
                  </Card>
                </SheetTrigger>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* SHEET CONTENT (ANSWER VIEW) */}
      {selectedQuestion && (
        <SheetContent className="sm:max-w-[70vw] w-full flex flex-col gap-0 p-0">
          {/* HEADER (Sticky) */}
          <SheetHeader className="border-b px-6 py-4 bg-background z-10">
            <div className="flex items-center gap-3 mb-2">
               <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedQuestion.user.imageUrl ?? ""} />
                  <AvatarFallback>U</AvatarFallback>
               </Avatar>
               <span className="text-xs text-muted-foreground">
                  Asked on {selectedQuestion.createdAt.toLocaleDateString()}
               </span>
            </div>
            <SheetTitle className="text-xl leading-normal">
                {selectedQuestion.question}
            </SheetTitle>
          </SheetHeader>

          {/* SCROLLABLE BODY */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-8">
                {/* Answer Block */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <MDEditor.Markdown 
                        source={selectedQuestion.answer} 
                        style={{ 
                            backgroundColor: 'transparent', 
                            color: 'inherit',
                            fontSize: 'inherit'
                        }} 
                    />
                </div>

                {/* References Block */}
                <div className="mt-8">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        Code Context
                        <Badge variant="secondary" className="text-xs">
                            {Array.isArray(selectedQuestion.filesReferences) ? (selectedQuestion.filesReferences as any[]).length : 0} files
                        </Badge>
                    </h3>
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
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
}

export default QaPage;