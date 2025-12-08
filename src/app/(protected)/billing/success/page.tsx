"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function SuccessContent() {
  const search = useSearchParams();
  const sessionId = search.get("session_id");

  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<number | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    async function fetchSession() {
      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        const data = await res.json();

        setAmount(data.amount);
        setCredits(data.credits);
      } finally {
        setLoading(false);
      }
    }

    void fetchSession();
  }, [sessionId]);

  if (!sessionId) return <p>Missing session ID.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Payment Succeeded</h1>
      <div className="h-3"></div>

      <p className="text-gray-700">Your purchase was completed successfully.</p>

      <div className="h-4"></div>

      <div className="rounded-md border p-4">
        <p className="text-sm">Stripe Session ID:</p>
        <p className="font-mono text-sm">{sessionId}</p>

        <div className="h-3"></div>

        {credits !== null && (
          <p className="text-sm">
            <strong>Credits purchased:</strong> {credits}
          </p>
        )}

        {amount !== null && (
          <p className="text-sm">
            <strong>Amount paid:</strong> ${(amount / 100).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p>Loading payment...</p>}>
      <SuccessContent />
    </Suspense>
  );
}
