"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { createCheckoutSession } from "@/lib/stripe";
import { api } from "@/trpc/react";
import { Info, Loader2 } from "lucide-react";
import React, { useState } from "react";
import CountUp from "@/components/react-bits/Count-up";

const BillingPage = () => {
  const { data: credits, isLoading } = api.project.getMyCredits.useQuery();
  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100]);
  const creditsToBuyAmount = creditsToBuy[0] ?? 0;

  // $0.02 per credit
  const price = (creditsToBuyAmount * 0.02).toFixed(2);

  return (
    <div className="mx-auto max-w-4xl space-y-12 p-4 py-8 lg:px-8">
      {/* 1. HEADER & CURRENT BALANCE */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Usage</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            nom.ai consumes biscuits as credits to index your codebase. 
            Purchase them here to keep building.
          </p>
        </div>

        {/* Floating Balance (Compact & Stable) */}
        <div className="flex flex-col items-start justify-center rounded-xl bg-secondary/20 px-8 py-4 md:items-end">
          <p className="text-muted-foreground mb-1 text-xs font-semibold uppercase tracking-wider">
            Your Balance
          </p>
          
          {/* Fixed height container (h-14) prevents layout shift */}
          <div className="flex h-14 items-center gap-2">
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground text-lg font-medium">biscuits</span>
                </div>
            ) : (
                <div className="flex items-baseline gap-2">
                    <div className="text-5xl font-bold text-primary leading-none">
                        <CountUp
                            from={0}
                            to={credits?.credits ?? 0}
                            separator=","
                            direction="up"
                            duration={1}
                            className="count-up-text"
                        />
                    </div>
                    <span className="text-muted-foreground text-lg font-medium">
                        biscuits
                    </span>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-border/40" />

      {/* 2. PURCHASE SECTION */}
      <div className="space-y-8">
        <div className="space-y-2">
            <h2 className="text-xl font-semibold">Purchase Credits</h2>
            <p className="text-muted-foreground text-sm">
                Unlock more indexing power for your larger projects.
            </p>
        </div>

        {/* Info Block (Soft Background, No Border) */}
        <div className="flex items-start gap-3 rounded-xl bg-muted/50 px-5 py-4 text-sm text-foreground">
             <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
             <div className="space-y-1">
                <p className="font-medium">How biscuits are used</p>
                <p className="text-muted-foreground">
                    Each biscuit allows you to index 1 file in a repository. 
                    If your project has 100 files, you need 100 biscuits.
                </p>
             </div>
        </div>

        {/* Slider Area (Subtle Background Pod) */}
        <div className="rounded-2xl bg-secondary/20 px-6 py-8">
            <div className="mb-8 flex items-end justify-between">
                <span className="font-medium text-foreground">
                    Amount to buy
                </span>
                <div className="text-3xl font-bold text-foreground">
                    {creditsToBuyAmount} <span className="text-sm font-medium text-muted-foreground">biscuits</span>
                </div>
            </div>

            <Slider
                defaultValue={[100]}
                max={1000}
                min={10}
                step={10}
                value={creditsToBuy}
                onValueChange={(value) => setCreditsToBuy(value)}
                className="cursor-pointer py-4"
            />
            
            <div className="mt-2 flex justify-between text-xs font-medium text-muted-foreground">
                <span>10 Credits</span>
                <span>1000 Credits</span>
            </div>
        </div>

        {/* Total & Checkout Row */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col items-center md:items-start">
                <span className="text-muted-foreground text-sm font-medium">
                    Total Cost
                </span>
                <span className="text-4xl font-bold text-foreground">
                    ${price}
                </span>
            </div>

            <Button
                size="lg"
                className="w-full md:w-auto min-w-[200px] shadow-lg hover:shadow-primary/20 transition-all text-base"
                onClick={async () => {
                await createCheckoutSession(creditsToBuyAmount);
                }}
            >
                Proceed to Checkout
            </Button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;