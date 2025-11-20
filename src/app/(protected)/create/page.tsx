"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken: string;
};

function CreatePage() {
  const { register, handleSubmit, reset } = useForm<FormInput>();

  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();

  const onSubmit = async (data: FormInput) => {
    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: async () => {
          toast.success("Project created successfully");
          void refetch().then(() => {
            reset();
          });
        },
        onError: () => {
          toast.error("Failed to create project");
        },
      },
    );

    return true;
  };

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
          <Input
            required
            placeholder="Repository URL"
            type="url"
            {...register("repoUrl")}
          />

          <Input
            required
            placeholder="Project Name"
            {...register("projectName")}
          />

          <Input placeholder="GitHub Token" {...register("githubToken")} />

          <Button
            variant="default"
            size="sm"
            type="submit"
            disabled={createProject.isPending}
          >
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;
