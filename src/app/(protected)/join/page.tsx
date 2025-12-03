"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Hash, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const JoinPage = () => {
  const [code, setCode] = useState("");
  const router = useRouter();

  const joinHandler = api.team.joinByCode.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("qode-project", data.projectId); // <-- FIXED
      toast.success("Successfully joined project!");
      router.push(`/dashboard`);
    },
    onError: (error) => {
      toast.error(error.message || "Invalid or expired code");
    },
  });

  const updateCode = (raw: string) => {
    // Only allow numbers and max 6 chars
    const cleaned = raw.replace(/\D/g, "").slice(0, 6);
    setCode(cleaned);
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) return;
    joinHandler.mutate({ code });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      
      {/* Back Link */}
      <div className="w-full max-w-md mb-8">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <Card className="w-full max-w-md border-muted-foreground/10 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Hash className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Join Project</CardTitle>
          <CardDescription>
            Enter the 6-digit invitation code provided by your project administrator.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  value={code}
                  onChange={(e) => updateCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  inputMode="numeric"
                  className={cn(
                    "h-14 text-center text-3xl tracking-[0.5em] font-mono transition-all",
                    // Change border color when 6 digits are filled
                    code.length === 6 && "border-primary bg-primary/5 ring-primary/20"
                  )}
                />
                {/* Floating label/hint */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                   <span className={cn(
                     "text-xs font-medium transition-colors",
                     code.length === 6 ? "text-primary" : "text-muted-foreground/50"
                   )}>
                     {code.length}/6
                   </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={code.length !== 6 || joinHandler.isPending}
            >
              {joinHandler.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Code...
                </>
              ) : (
                "Join Project"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Footer Helper */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don't have a code?{" "}
        <Link href="/create" className="font-medium text-primary hover:underline underline-offset-4">
          Create a new project
        </Link>
      </p>
    </div>
  );
};

export default JoinPage;