"use client";

import React from "react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Instrument_Serif } from "next/font/google";
import { ArrowRight } from "lucide-react";
import HeroBackground from "./_components/hero-background";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

// ⭐ NEW IMPORT — replaces the Features section
import UseCasesSection from "@/app/(marketing)/_components/UseCasesSection";

const serifFont = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

// Animation variants
const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.2, duration: 1 },
  },
};

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden text-white selection:bg-blue-500/30">
      {/* Background */}
      <HeroBackground />
      <div className="absolute inset-0 -z-10 bg-black/20" />

      {/* HERO SECTION */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-28 text-center md:pt-40">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          v2.0 is now live
        </motion.div>

        {/* Hero Text */}
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.h1
            variants={item}
            className={`max-w-4xl text-5xl leading-tight font-medium tracking-tight md:text-7xl ${serifFont.className}`}
          >
            Build the future, <br />
            <span className="text-white/90">powered by intelligence.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-2xl text-lg text-white/80 md:text-xl"
          >
            Nom.ai provides the essential infrastructure for your next big idea.
            Manage projects, track analytics, and deploy faster.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <SignInButton mode="modal">
              <Button
                size="lg"
                className="rounded-full bg-white text-black shadow-xl hover:bg-neutral-200"
              >
                Get Started for Free
              </Button>
            </SignInButton>

            <Link href="/features">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
              >
                View Features <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2, type: "spring", bounce: 0 }}
          className="relative mx-auto mt-28 w-full max-w-7xl px-6 pb-40"
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl ring-1 ring-white/10 backdrop-blur-md"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 60%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 60%, transparent 100%)",
            }}
          >
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-3">
              <div className="size-3 rounded-full bg-red-500/20"></div>
              <div className="size-3 rounded-full bg-yellow-500/20"></div>
              <div className="size-3 rounded-full bg-green-500/20"></div>
            </div>

            <img
              src="/preview.png"
              alt="Dashboard Preview"
              className="h-auto w-full object-cover opacity-90"
            />
          </div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-b from-transparent to-black" />
      </section>

      {/* ⭐ REPLACED FEATURES SECTION WITH USE CASES SECTION ⭐ */}
      <UseCasesSection />

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black py-10 text-center text-sm text-white/40">
        © 2025 Nom.ai Inc. All rights reserved.
      </footer>
    </div>
  );
}
