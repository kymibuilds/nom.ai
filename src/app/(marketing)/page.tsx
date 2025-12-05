"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Instrument_Serif } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

// --- COMPONENTS ---
import HeroBackground from "./_components/hero-background";
import ConceptSection from "./_components/concept-section";
import IntegrationsSection from "./_components/integrations-section";
import PricingSection from "./_components/pricing-section";
import CTASection from "./_components/cta-section";
import { WordRotate } from "@/components/magicui/word-rotate";
import UseCasesSection from "./_components/usecase-section";
import FAQSection from "./_components/faq-secion";
import Footer from "./_components/footer";

const serifFont = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

// --- ANIMATION VARIANTS ---
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
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10 h-screen w-full">
        <HeroBackground />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-32 text-center md:pt-40">
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
          coming soon
        </motion.div>

        {/* Hero Text */}
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.h1
            variants={item}
            className={`max-w-4xl text-5xl leading-tight font-medium tracking-tight md:text-7xl ${serifFont.className}`}
          >
            The agent that connects your codebase, <br />
            <span className="mx-auto flex items-center justify-center gap-x-2 text-white/80 translate-x-6">
              <p>‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ </p>conversations, and{" "}
              <span className="inline-block min-w-[5em] translate-y-[0px] text-left">
                <WordRotate
                  className="font-medium text-white"
                  words={["tasks", "meetings", "workflows"]}
                />
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-8 max-w-2xl text-center text-lg font-light text-neutral-300 md:text-xl"
          >
            Stop digging through folders. Nom.ai indexes your repo, listens to
            your meetings, and helps you deploy features without the mental
            overhead.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <SignInButton mode="modal">
              <Button
                size="lg"
                className="rounded-full bg-white px-8 text-black shadow-xl hover:bg-neutral-200"
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
          className="relative z-10 mx-auto mt-28 mb-[-200px] w-full max-w-7xl px-6"
        >
          <div className="relative overflow-hidden rounded-t-2xl border-t border-r border-l border-white/10 bg-neutral-900/50 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-4 py-3">
              <div className="size-3 rounded-full bg-red-500/20"></div>
              <div className="size-3 rounded-full bg-yellow-500/20"></div>
              <div className="size-3 rounded-full bg-green-500/20"></div>
            </div>

            <Image
              src="/preview.png"
              alt="Dashboard Preview"
              width={1400}
              height={1000}
              className="h-auto w-full object-cover opacity-100"
            />

            <div className="absolute bottom-0 left-0 h-2/3 w-full bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          </div>
        </motion.div>
      </section>

      {/* 1. CONCEPT */}
      <ConceptSection />

      {/* 2. USE CASES */}
      <UseCasesSection />

      {/* 3. INTEGRATIONS */}
      <IntegrationsSection />

      {/* 4. PRICING */}
      <PricingSection />

      {/* 5. FAQ */}
      <FAQSection />

      {/* 6. CTA */}
      <CTASection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
