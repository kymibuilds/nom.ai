"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CancelContent() {
  const search = useSearchParams();
  const sessionId = search.get("session_id");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-red-600">Payment Cancelled</h1>
      <div className="h-3"></div>

      <p className="text-gray-700">
        Your payment was cancelled. No charges were made.
      </p>

      <div className="h-4"></div>

      {sessionId && (
        <div className="rounded-md border p-4">
          <p className="text-sm">Stripe Session ID:</p>
          <p className="font-mono text-sm">{sessionId}</p>
        </div>
      )}
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CancelContent />
    </Suspense>
  );
}
