"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken: string;
};

function CreatePage() {
  const { register, handleSubmit, reset } = useForm<FormInput>();

  const onSubmit = (data: FormInput) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="flex items-center gap-12 h-full justify-center">
      <Image src={"/undraw_github.svg"} height={160} width={160} alt="alt" />

      <div className="max-w-96">
        <div>
          <h1 className="font-semibold text-2xl">Link your github repo</h1>
          <p className="text-sm text-muted-foreground">
            Enter the Url of your repository to link it to qode.
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

          <Input
            placeholder="GitHub Token"
            {...register("githubToken")}
          />

          <Button
          variant={"default"} size={"sm"}
          type="submit">
            Calculate Tokens
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;
