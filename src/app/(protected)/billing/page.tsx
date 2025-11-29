"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { createCheckoutSession } from "@/lib/stripe";
import { api } from "@/trpc/react";
import { Info } from "lucide-react";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import CountUp from "@/components/react-bits/Count-up";

const BillingPage = () => {
  const { data: credits } = api.project.getMyCredits.useQuery();
  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100]);
  const creditsToBuyAmount = creditsToBuy[0] ?? 0;

  // $0.02 per credit
  const price = (creditsToBuyAmount * 0.02).toFixed(2);

  return (
    <div className="max-w-4xl space-y-8 p-4">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
        <p className="text-muted-foreground text-sm">
          nom.ai consumes biscuits as credits to index your codebase, purchase them from this page.
        </p>
      </div>

      {/* CURRENT BALANCE CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardDescription>Your available biscuits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold">
            <CountUp
              from={0}
              to={credits?.credits ?? 0}
              separator=","
              direction="up"
              duration={0.3}
              className="count-up-text"
            />
            <span className="text-muted-foreground ml-2 text-lg font-medium">
              biscuits
            </span>
          </div>
        </CardContent>
      </Card>

      {/* PURCHASE SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase More</CardTitle>
          <CardDescription>
            Purchase more biscuits to index larger projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* INFO ALERT - Replaced custom div with Shadcn Alert */}
          <Alert className="bg-muted/50 border-none">
            <Info className="h-4 w-4" />
            <AlertTitle>How biscuits are used</AlertTitle>
            <AlertDescription className="text-muted-foreground mt-1 text-sm">
              Each biscuit allows you to index 1 file in a repository. For
              example, if your project has 100 files, you will need 100 biscuits.
            </AlertDescription>
          </Alert>

          {/* SLIDER CONTROLS */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Amount:</span>
              <Badge variant="secondary" className="rounded-md px-3 text-base">
                {creditsToBuyAmount}
              </Badge>
            </div>

            <Slider
              defaultValue={[100]}
              max={1000}
              min={10}
              step={10}
              value={creditsToBuy}
              onValueChange={(value) => setCreditsToBuy(value)}
              className="py-4"
            />

            <div className="text-muted-foreground flex justify-between text-xs">
              <span>10 Credits</span>
              <span>1000 Credits</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/20 flex flex-col items-end gap-4 border-t p-6 md:flex-row md:justify-between">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-muted-foreground text-sm font-medium">Total</p>
            <p className="text-3xl font-bold">${price}</p>
          </div>

          <Button
            size="lg"
            className="w-full md:w-auto"
            onClick={async () => {
              await createCheckoutSession(creditsToBuyAmount);
            }}
          >
            Proceed to Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BillingPage;
