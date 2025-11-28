"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useProject from "@/hooks/use-project";
import { UserPlus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function InviteButton() {
  const { projectId } = useProject();
  const [open, setOpen] = useState(false);

  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/project/join/${projectId}`;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-500">
            Ask them to copy and paste this link
          </p>

          <Input
            className="mt-4"
            readOnly
            value={link}
            onClick={() => {
              void navigator.clipboard.writeText(link);
              toast.success("copied to clipboard");
            }}
          />
        </DialogContent>
      </Dialog>

      <Button size="sm" className="flex items-center" onClick={() => setOpen(true)}>
        <UserPlus />
        Invite Members
      </Button>
    </>
  );
}

export default InviteButton;
