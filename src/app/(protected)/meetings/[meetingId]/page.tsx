import React from "react";
import IssuesList from "./issues-list";

export default async function MeetingDetailsPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;

  return <IssuesList meetingId={meetingId} />;
}

