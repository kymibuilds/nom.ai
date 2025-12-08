"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [calculating, setCalculating] = useState(false);
  const [fileCount, setFileCount] = useState<number | null>(null);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const calculateBiscuits = async () => {
    if (!repoUrl || repoUrl.trim() === "") {
      setCalcError("Enter a repository URL first.");
      return;
    }

    setCalculating(true);
    setCalcError(null);
    setFileCount(null);
    setUserCredits(null);

    try {
      const res = await checkCredits.mutateAsync({
        githubUrl: repoUrl,
      });

      setFileCount(res.fileCount ?? null);
      setUserCredits(res.userCredits ?? null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to calculate biscuits";
      setCalcError(message);
    } finally {
      setCalculating(false);
    }
  };

  const onSubmit = async (data: FormInput) => {
    try {
      const creditResult = await checkCredits.mutateAsync({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      });

      const required = creditResult.fileCount;
      const creditsHave = creditResult.userCredits;

      if (required > creditsHave) {
        toast.error(
          `Not enough biscuits. Repo needs ${required} but you have ${creditsHave}.`,
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
        onSuccess: () => {
          toast.success("Project created successfully");
          router.push("/dashboard");

          void refetch().then(() => {
            reset();
            setFileCount(null);
            setUserCredits(null);
          });
          router.push("/dashboard");
        },
        onError: () => {
          toast.error("Failed to create project");
        },
      },
    );
  };

  const helperText =
    calcError ??
    (calculating
      ? "Calculating biscuits..."
      : fileCount !== null
        ? `Requires ${fileCount} biscuits — you have ${userCredits ?? 0}.`
        : "Press 'Check Credits' to calculate biscuits.");

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
            <p className="text-muted-foreground mt-1 text-sm">{helperText}</p>
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

          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={calculateBiscuits}
              disabled={calculating}
            >
              Check Credits
            </Button>

            <Button
              variant="default"
              size="sm"
              type="submit"
              disabled={createProject.isPending}
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;
