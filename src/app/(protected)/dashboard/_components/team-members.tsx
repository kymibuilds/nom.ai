"use client";

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import Image from "next/image";
import React from "react";

function TeamMembers() {
  const { projectId } = useProject();
  const { data: members } = api.project.getTeamMembers.useQuery({ projectId });
  return <div className="flex items-center gap-2">
    {
        members?.map(member =>(
            <Image key={member.id} src={member.user.imageUrl ?? "/defaultAvatar.png"} alt="user url" width={28} height={28} className="rounded-full"/>
        ))
    }
  </div>;
}

export default TeamMembers;
