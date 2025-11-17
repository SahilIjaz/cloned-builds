"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (sessionId && !processed) {
      handleSuccessfulPayment();
    }
  }, [sessionId, processed]);

  const handleSuccessfulPayment = async () => {
    try {
      // Mark order as completed
      const response = await fetch("/api/checkout/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete order");
      }

      setProcessed(true);
      toast.success("Order completed successfully!");
    } catch (error: any) {
      console.error("Error completing order:", error);
      // Don't show error to user as payment was successful
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-screen bg-slate-950">
      <div className="max-w-[600px] w-[90%] text-center">
        <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-12">
          <CheckCircle className="w-24 h-24 text-[#7ED348] mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Thank you for your purchase. Your order has been confirmed and is
            being processed.
          </p>

          {sessionId && (
            <p className="text-gray-500 text-sm mb-8">
              Session ID: {sessionId}
            </p>
          )}

          <div className="space-y-4">
            <button
              onClick={() => router.push("/tracking")}
              className="w-full bg-[#7ED348] hover:bg-[#6BC23A] text-black font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-3"
            >
              Track My Order
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/builds")}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-3"
            >
              View My Builds
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/browse")}
              className="w-full bg-transparent border-2 border-slate-600 hover:border-[#7ED348] text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-3"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
