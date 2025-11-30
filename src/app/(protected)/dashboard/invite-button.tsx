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
import { Label } from "@/components/ui/label"; // Optional, usually available in shadcn
import useProject from "@/hooks/use-project";
import { Copy, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function InviteButton() {
  const { projectId } = useProject();
  const [open, setOpen] = useState(false);

  // Fallback to empty string on server-side to avoid hydration mismatch
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = `${origin}/project/join/${projectId}`;

  const handleCopy = () => {
    void navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
    setOpen(false); // Optional: close modal on copy
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
            <DialogDescription>
              Share this link with your team to collaborate on this project.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-y-4 py-2">
             {/* Copy Link Section */}
             <div className="flex flex-col gap-2">
                <Label className="sr-only">Invite Link</Label>
                <div className="flex items-center gap-2">
                    <Input
                        className="flex-1 bg-muted/50 text-muted-foreground shadow-none focus-visible:ring-0"
                        readOnly
                        value={link}
                    />
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={handleCopy}
                        className="shrink-0"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
             </div>
          </div>

          <div className="flex justify-end">
             {/* Optional: 'Done' button if you don't close on copy */}
             {/* <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Done
             </Button> */}
          </div>
        </DialogContent>
      </Dialog>

      <Button size="sm" onClick={() => setOpen(true)}>
        <UserPlus className="w-4 h-4 mr-2" />
        Invite Members
      </Button>
    </>
  );
}

export default InviteButton;