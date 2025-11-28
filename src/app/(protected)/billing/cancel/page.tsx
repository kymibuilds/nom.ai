"use client";

export default function CancelPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Payment Canceled</h1>
      <div className="h-3"></div>

      <p className="text-gray-700">
        Your payment was canceled. No charges were made.
      </p>

      <div className="h-4"></div>

      <div className="rounded-md border p-4">
        <p className="text-sm">
          You can try again anytime from the billing page.
        </p>
      </div>
    </div>
  );
}
