"use client";

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import Image from "next/image";
import React from "react";

function TeamMembers() {
  const { projectId } = useProject();
  const { data: members } = api.project.getTeamMembers.useQuery({ projectId });

  if (!members) return null;

  const visible = members.slice(0, 4);
  const extra = members.length - visible.length;

  return (
    <div className="flex items-center gap-2">
      {visible.map((member) => (
        <Image
          key={member.id}
          src={member.user.imageUrl ?? "/defaultAvatar.png"}
          alt="user avatar"
          width={28}
          height={28}
          className="rounded-full"
        />
      ))}

      {extra > 0 && (
        <div className="size-[28px] rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
          +{extra}
        </div>
      )}
    </div>
  );
}

export default TeamMembers;
