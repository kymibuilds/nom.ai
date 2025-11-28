"use client";

import * as React from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type AvatarWithTooltipType = {
  src: string;
  name: string;
  status?: keyof typeof statusColors;
};

type AvatarGroupWithTooltipsProps = {
  avatars?: AvatarWithTooltipType[];
  maxDisplay?: number;
  showStatus?: boolean;
  delayDuration?: number;
  className?: string;
};

export const DEFAULT_AVATARS: AvatarWithTooltipType[] = [
  {
    src: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "John Doe",
    status: "online",
  },
  {
    src: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Sarah Smith",
    status: "busy",
  },
  {
    src: "https://randomuser.me/api/portraits/men/91.jpg",
    name: "Alex Wong",
    status: "away",
  },
  {
    src: "https://randomuser.me/api/portraits/women/17.jpg",
    name: "Emma Johnson",
    status: "online",
  },
];

const statusColors = {
  online: "bg-green-500",
  busy: "bg-red-500",
  away: "bg-amber-500",
  offline: "bg-gray-400",
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export const AvatarGroupWithTooltips = React.forwardRef<
  HTMLDivElement,
  AvatarGroupWithTooltipsProps
>((props, ref) => {
  const {
    avatars = DEFAULT_AVATARS,
    maxDisplay = avatars.length,
    showStatus = false,
    delayDuration = 300,
    className,
  } = props;

  const displayAvatars = React.useMemo(
    () => avatars.slice(0, maxDisplay),
    [avatars, maxDisplay]
  );

  const remainingCount = avatars.length - maxDisplay;

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <div
        ref={ref}
        className={cn(
          "bg-background flex items-center justify-center rounded-md p-0",
          className
        )}
      >
        <div className="flex items-center relative">
          {displayAvatars.map((avatar, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={cn("relative hover:z-10", index > 0 && "-ml-2")}
                >
                  <Avatar className="transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg border-2 border-background">
                    <AvatarImage src={avatar.src} alt={avatar.name} />
                    <AvatarFallback>{getInitials(avatar.name)}</AvatarFallback>
                  </Avatar>
                  {showStatus && avatar.status && (
                    <span
                      className={cn(
                        "absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-background",
                        statusColors[avatar.status]
                      )}
                    />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                {avatar.name}
                {showStatus && avatar.status && (
                  <span className="block text-xs capitalize text-muted-foreground">
                    {avatar.status}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ))}

          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn("relative hover:z-10", "-ml-2")}>
                  <Avatar className="transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg border-2 border-background bg-muted">
                    <AvatarFallback>+{remainingCount}</AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                {remainingCount} more {remainingCount === 1 ? "user" : "users"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
});

AvatarGroupWithTooltips.displayName = "AvatarGroupWithTooltips";

