"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/theme-toggle-button";
import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, Fingerprint, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";

const SettingsModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* ACCOUNT SECTION */}
          <div className="space-y-4">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Account
            </h4>

            {/* Username */}
            <div className="grid gap-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-3.5 w-3.5" /> Username
              </Label>
              <Input
                id="username"
                value={user?.username ?? user?.fullName ?? "Guest"}
                disabled
                className="bg-muted/50 font-medium"
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> Email
              </Label>
              <Input
                id="email"
                value={user?.primaryEmailAddress?.emailAddress ?? ""}
                disabled
                className="bg-muted/50 text-muted-foreground"
              />
            </div>

            {/* User ID */}
            <div className="grid gap-2">
              <Label htmlFor="userid" className="flex items-center gap-2">
                <Fingerprint className="h-3.5 w-3.5" /> User ID
              </Label>
              <div className="relative">
                <Input
                  id="userid"
                  value={user?.id ?? ""}
                  disabled
                  className="bg-muted/50 text-muted-foreground font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* PREFERENCES SECTION */}
          <div className="space-y-4">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Preferences
            </h4>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">Appearance</Label>
                <p className="text-muted-foreground text-xs">
                  Customize how nom looks on your device.
                </p>
              </div>
              <ModeToggle />
            </div>
          </div>

          <Separator />

          {/* ACTIONS */}
          <div className="flex items-center justify-end">
            <Button
              variant="destructive"
              onClick={() => signOut(() => router.push("/"))}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
