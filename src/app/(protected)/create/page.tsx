"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken: string;
};

function CreatePage() {
  const { register, handleSubmit, reset, watch } = useForm<FormInput>({
    defaultValues: { repoUrl: "", projectName: "", githubToken: "" },
  });

  const repoUrl = watch("repoUrl");

  const createProject = api.project.createProject.useMutation();
  const checkCredits = api.project.checkCredits.useMutation();
  const refetch = useRefetch();

  const [calculating, setCalculating] = useState(false);
  const [fileCount, setFileCount] = useState<number | null>(null);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    setCalcError(null);
    setFileCount(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!repoUrl || repoUrl.trim() === "") {
      setCalculating(false);
      return;
    }

    setCalculating(true);

    debounceRef.current = setTimeout(() => {
      const requestId = ++reqIdRef.current;

      const runCheck = async () => {
        try {
          const res = await checkCredits.mutateAsync({
            githubUrl: repoUrl,
          });

          if (requestId !== reqIdRef.current) return;

          setFileCount(res.fileCount ?? null);
          setUserCredits(res.userCredits ?? null);
          setCalcError(null);
        } catch (err: unknown) {
          if (requestId !== reqIdRef.current) return;

          const message =
            err instanceof Error ? err.message : "Failed to calculate credits";

          setCalcError(message);
          setFileCount(null);
          setUserCredits(null);
        } finally {
          if (requestId === reqIdRef.current) {
            setCalculating(false);
          }
        }
      };

      void runCheck();
    }, 700);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [repoUrl, checkCredits]);

  const onSubmit = async (data: FormInput) => {
    try {
      const creditResult = await checkCredits.mutateAsync({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      });

      const { fileCount: required, userCredits: creditsHave } = creditResult;

      if (required > creditsHave) {
        toast.error(
          `Not enough biscuits. Repo needs ${required} but you have ${creditsHave}.`
        );
        return;
      }
    } catch {
      toast.error("Failed to validate credits before creating project.");
      return;
    }

    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSuccess: async () => {
          toast.success("Project created successfully");
          void refetch().then(() => {
            reset();
            setFileCount(null);
            setUserCredits(null);
          });
        },
        onError: () => {
          toast.error("Failed to create project");
        },
      }
    );
  };

  const helperText = calculating
    ? "Calculating biscuits..."
    : calcError ??
      (fileCount === null
        ? "Enter a repository URL to see biscuits required."
        : `Requires ${fileCount} biscuits — you have ${userCredits ?? 0}.`);

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <Image src={"/undraw_github.svg"} height={160} width={160} alt="alt" />

      <div className="max-w-96">
        <div>
          <h1 className="text-2xl font-semibold">Link your GitHub repo</h1>
          <p className="text-muted-foreground text-sm">
            Enter the URL of your repository to link it to Qode.
          </p>
        </div>

        <div className="h-4" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Input
              required
              placeholder="Repository URL"
              type="url"
              {...register("repoUrl")}
            />
            <p
              className={`text-sm mt-1 ${
                calculating
                  ? "text-gray-500"
                  : calcError
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            >
              {helperText}
            </p>
          </div>

          <Input
            required
            placeholder="Project Name"
            {...register("projectName")}
          />

          <Input
            placeholder="GitHub Token (optional)"
            {...register("githubToken")}
          />

          <Button
            variant="default"
            size="sm"
            type="submit"
            disabled={createProject.isPending || calculating}
          >
            Check Credits
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;