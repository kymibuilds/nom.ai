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
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <AskQuestionCard />
      <div className="h-4" />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Saved Questions</h1>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium 
                     text-gray-700 bg-white border border-gray-300 rounded-md 
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-colors"
          title="Refresh"
        >
          <RefreshCw
            className={cn(
              "h-3 w-3",
              isRefreshing && "animate-spin"
            )}  
          />
          {isRefreshing ? "Refreshing...": "Refresh"}
        </button>
      </div>

      <div className="h-2" />

      <div className="flex flex-col gap-2">
        {questions?.map((question, index) => (
          <React.Fragment key={question.id}>
            <SheetTrigger onClick={() => setQuestionIndex(index)}>
              <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow">
                <Image
                  className="rounded-full"
                  height={30}
                  width={30}
                  src={question.user.imageUrl ?? ""}
                  alt="image"
                />

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <p className="line-clamp-1 text-lg font-medium text-gray-700">
                      {question.question}
                    </p>
                    <span className="text-xs whitespace-nowrap text-gray-400">
                      {question.createdAt.toLocaleDateString()}
                    </span>
                  </div>

                  <p className="line-clamp-1 text-sm text-gray-500">
                    {question.answer}
                  </p>
                </div>
              </div>
            </SheetTrigger>
          </React.Fragment>
        ))}
      </div>

      {selectedQuestion && (
        <SheetContent className="sm:max-w-[80vw]">
          <SheetHeader>
            <SheetTitle>{selectedQuestion.question}</SheetTitle>

            <MDEditor.Markdown source={selectedQuestion.answer} />

            <CodeReferences
              filesReferences={
                (selectedQuestion.filesReferences as {
                  fileName: string;
                  sourceCode: string;
                  summary: string;
                }[]) ?? []
              }
            />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
}

export default QaPage;
