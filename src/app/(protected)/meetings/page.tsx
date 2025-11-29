"use client";

import useProject from '@/hooks/use-project';
import { api } from '@/trpc/react';
import React from 'react';
import MeetingCard from '../dashboard/meeting-card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { BouncingDots } from '@/components/molecule-ui/bouncing-dots';
import { Ghost, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function MeetingsPage() {
  const { projectId } = useProject();
  const { data: meetings, isLoading } = api.project.getMeetings.useQuery(
    { projectId },
    { refetchInterval: 4000 }
  );

  return (
    <div className="flex flex-col gap-6">
      
      <MeetingCard />

      <div className="h-full w-full">
        <h1 className="text-xl font-semibold mb-4">Meetings</h1>

        {isLoading && (
          <div className="flex h-60 items-center justify-center border rounded-lg bg-gray-50/50">
             <BouncingDots message='Loading meetings...' messagePlacement='bottom' dots={3}/>
          </div>
        )}

        {!isLoading && meetings?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-60 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <Ghost className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500 font-medium">No meetings found</p>
            <p className="text-xs text-gray-400 mt-1">Start recording to see them here.</p>
          </div>
        )}

        {/* LIST STATE */}
        {!isLoading && meetings && meetings.length > 0 && (
          <ul className="divide-y divide-gray-200 border rounded-md shadow-sm bg-white">
            {meetings.map((meeting) => (
              <li 
                key={meeting.id} 
                className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2">
                    {/* Link covers the text, but the whole row feels interactive due to hover */}
                    <Link 
                      href={`/meetings/${meeting.id}`} 
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                    >
                      {meeting.name}
                    </Link>
                    
                    {meeting.status === "PROCESSING" && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
                        Processing...
                      </Badge>
                    )}
                  </div>

                  {/* Date Metadata */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{new Date(meeting.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                    <Link href={`/meetings/${meeting.id}`}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500">
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MeetingsPage;

//task add delete meetings button here