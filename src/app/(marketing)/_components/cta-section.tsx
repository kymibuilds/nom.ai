"use client";

import React from "react";
import { Instrument_Serif } from "next/font/google";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

const serifFont = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function CTASection() {
  return (
    <section className="relative z-10 border-t border-white/10 bg-black py-32 text-center text-white">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[80px]" />

      <div className="mx-auto max-w-3xl px-6">
        <h2 className={`text-5xl md:text-7xl ${serifFont.className}`}>
          Ready to sync?
        </h2>
        <p className="mt-6 text-xl font-light text-neutral-400">
          Stop digging through files. Start collaborating with intelligence.
          <br className="hidden md:block" />
          The agent is ready when you are.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <SignInButton mode="modal">
            <Button
              size="lg"
              className="h-14 rounded-full bg-white px-8 text-lg text-black hover:bg-neutral-200"
            >
              Start Building Free
            </Button>
          </SignInButton>

          <Button variant="link" className="text-neutral-400 hover:text-white">
            Read the docs <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <p className="mt-8 font-mono text-xs text-neutral-600">
          NO CREDIT CARD REQUIRED • 150 FREE BISCUITS ON SIGNUP
        </p>
      </div>
    </section>
  );
}
