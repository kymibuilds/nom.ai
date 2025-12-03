"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useProject from "@/hooks/use-project";
import { Copy, UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/trpc/react";

export default function InviteButton() {
  const { projectId } = useProject();

  console.log("[InviteButton] projectId =", projectId);

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const createJoinCode = api.team.createJoinCode.useMutation({
    onMutate: () => {
      console.log("[InviteButton] createJoinCode.mutate() fired");
    },
    onSuccess: (data) => {
      console.log("[InviteButton] createJoinCode SUCCESS:", data);

      setCode(data.code);
      setExpiresAt(data.expiresAt.toISOString());
      setOpen(true); // show modal AFTER code arrives
    },
    onError: (err) => {
      console.log("[InviteButton] createJoinCode ERROR:", err);
      toast.error("Failed to generate join code");
    },
  });

  const generate = () => {
    console.log("[InviteButton] generate() called. projectId =", projectId);

    if (!projectId) {
      console.log("[InviteButton] NO PROJECT ID → abort");
      toast.error("Project not loaded");
      return;
    }

    console.log("[InviteButton] Sending mutation…");
    createJoinCode.mutate({ projectId, ttlHours: 24 });
  };

  const handleCopy = () => {
    console.log("[InviteButton] handleCopy() clicked. code =", code);
    if (!code) return;
    void navigator.clipboard.writeText(code);
    toast.success("Join code copied");
  };

  return (
    <>
      <Button 
        size="sm" 
        onClick={generate} 
        disabled={!projectId || createJoinCode.isPending}
      >
        {createJoinCode.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Members
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
            <DialogDescription>
              Share this 6-digit code with your team.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-y-4 py-2">
            <div className="flex flex-col gap-2">
              <Label>Join Code</Label>
              <div className="flex items-center gap-2">
                <Input
                  className="flex-1 text-center font-mono text-xl"
                  readOnly
                  value={code ?? ""}
                />
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleCopy}
                  disabled={!code}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {expiresAt && (
                <p className="text-xs text-muted-foreground">
                  Expires: {new Date(expiresAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
