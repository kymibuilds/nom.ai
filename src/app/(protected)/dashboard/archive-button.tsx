"use client";

import { Button } from '@/components/ui/button'
import useProject from '@/hooks/use-project';
import useRefetch from '@/hooks/use-refetch';
import { api } from '@/trpc/react';
import { Trash2 } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';

function ArchiveButton() {
    const archiveProject = api.project.archiveProject.useMutation();
    const {projectId} = useProject();
    const refetch  = useRefetch();
  return (
    <Button disabled={archiveProject.isPending} className='flex justify-center bg-red-500' size={"sm"} variant={"destructive"} onClick={()=>{
        const confirm = window.confirm("are you sure you want to archive this project")
        if(confirm) archiveProject.mutate({projectId: projectId},{
            onSuccess: ()=>{
                toast.success("project archived")
                void refetch();
            },
            onError: () => {
                toast.error("failed to archive project")
            }
        })
    }}>
        <Trash2 />
        Archive
    </Button>
  )
}

export default ArchiveButton