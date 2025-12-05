"use client";

import React, { useState } from "react";
import { Instrument_Serif } from "next/font/google";
import { Check, Cookie, FileCode, Mic, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const serifFont = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function PricingSection() {
  const [biscuits, setBiscuits] = useState(500);

  // Math: 100 biscuits = $2.00
  const price = (biscuits / 100) * 2;

  // Calculate percentage for slider background fill
  const max = 5000;
  const percentage = (biscuits / max) * 100;

  return (
    <section className="relative z-10 border-t border-white/10 bg-black py-32 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left Column: The Pitch */}
          <div>
            <h2 className={`text-4xl md:text-5xl ${serifFont.className}`}>
              Feed Nom. <br />
              <span className="text-neutral-500">Pay as you go.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed font-light text-neutral-400">
              Pay only to teach Nom your code or process meetings. Once
              knowledge is indexed, you own it forever. Querying, chatting, and
              explaining are completely free.
            </p>

            {/* The "Menu" (What does a biscuit buy?) */}
            <div className="mt-12 space-y-6">
              <h3 className="text-sm font-medium tracking-widest text-neutral-500 uppercase">
                Consumption Menu
              </h3>

              {/* Item 1: File Indexing */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-white/5 text-neutral-300">
                    <FileCode className="h-4 w-4" />
                  </div>
                  <span className="text-neutral-200">Index 1 New File</span>
                </div>
                <span className="font-mono text-sm text-neutral-500">
                  1 Biscuit
                </span>
              </div>

              {/* Item 2: Meeting Context (New) */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-white/5 text-neutral-300">
                    <Mic className="h-4 w-4" />
                  </div>
                  <span className="text-neutral-200">Meeting Intelligence</span>
                </div>
                <span className="font-mono text-sm text-neutral-500">
                  ~0.1 Biscuits / min
                </span>
              </div>

              {/* Item 3: Queries (Free) */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/10 text-white">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <span className="text-neutral-200">
                    Unlimited Queries & Chat
                  </span>
                </div>
                <span className="font-mono text-sm text-white">FREE</span>
              </div>

              {/* Item 4: Re-indexing (Free) */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/10 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-neutral-200">
                    Re-indexing Cached Files
                  </span>
                </div>
                <span className="font-mono text-sm text-white">FREE</span>
              </div>
            </div>
          </div>

          {/* Right Column: The Calculator */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm lg:p-12">
            {/* Visual Header */}
            <div className="mb-10 flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-400">Total Credits</div>
                <div className={`mt-1 text-3xl ${serifFont.className}`}>
                  {biscuits.toLocaleString()} Biscuits
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Cookie className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* The Slider */}
            <div className="mb-12">
              <input
                type="range"
                min="100"
                max={max}
                step="100"
                value={biscuits}
                onChange={(e) => setBiscuits(Number(e.target.value))}
                className="h-2 w-full appearance-none rounded-lg bg-white/10 outline-none"
                style={{
                  background: `linear-gradient(to right, white ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)`,
                }}
              />
              <div className="mt-4 flex justify-between font-mono text-xs text-neutral-500">
                <span>100</span>
                <span>{max}+</span>
              </div>
            </div>

            {/* Price Output */}
            <div className="flex items-end justify-between border-t border-white/10 pt-8">
              <div>
                <div className="text-sm text-neutral-400">Total Price</div>
                <div className="text-4xl font-light tracking-tight text-white">
                  ${price.toFixed(2)}
                </div>
              </div>
              <Button className="h-12 bg-white px-8 text-black hover:bg-neutral-200">
                Buy Biscuits
              </Button>
            </div>

            <p className="mt-6 text-center text-xs text-neutral-600">
              Credits never expire. One-time payment via Stripe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
