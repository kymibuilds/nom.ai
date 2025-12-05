"use client";

import React from "react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Instrument_Serif } from "next/font/google";
import { ArrowRight, Zap, Lock, Sparkles } from "lucide-react";
import HeroBackground from "./_components/hero-background";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

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
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.25, duration: 0.9 },
  },
};

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">

      {/* Shader Background */}
      <div className="fixed inset-0 -z-10 h-screen w-full">
        <HeroBackground />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* HERO SECTION */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center md:pt-40">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          v2.0 is now live
        </motion.div>

        {/* Animated Heading + Subtext */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.h1
            variants={item}
            className={`max-w-4xl text-5xl font-medium leading-[1.1] tracking-tight md:text-7xl ${serifFont.className}`}
          >
            Build the future, <br />
            <span className="text-white/60">powered by intelligence.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-2xl text-lg text-neutral-300 md:text-xl"
          >
            Nom.ai provides the essential infrastructure for your next big idea.
            Manage projects, track analytics, and deploy faster.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row">
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

        {/* DASHBOARD PREVIEW (NO opacity issues, smooth abyss fade) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1.1, type: "spring", bounce: 0.1 }}
          className="relative mt-28 w-full max-w-7xl mx-auto px-6 pb-40"
        >
          <div
            className="
              relative overflow-hidden rounded-2xl
              border border-white/10 bg-black/30
              backdrop-blur-sm shadow-[0_25px_80px_-10px_rgba(0,0,0,0.8)]
              ring-1 ring-white/10
            "
            style={{
              maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
            }}
          >
            {/* Browser top bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/40">
              <div className="size-3 rounded-full bg-red-500/30" />
              <div className="size-3 rounded-full bg-yellow-500/30" />
              <div className="size-3 rounded-full bg-green-500/30" />
            </div>

            <img
              src="/preview.png"
              alt="Dashboard Preview"
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>

        {/* Smooth abyss fade */}
        <div className="absolute bottom-0 left-0 h-60 w-full bg-gradient-to-b from-transparent to-black pointer-events-none" />
      </section>

      {/* FEATURES SECTION */}
      <section className="relative z-10 border-t border-white/10 bg-black py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className={`text-3xl md:text-5xl ${serifFont.className}`}>
              Everything you need
            </h2>
            <p className="mt-4 text-white/60">
              Powerful features built for modern development teams.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Lightning Fast"
              desc="Optimized for speed. Zero-latency updates."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Secure"
              desc="Enterprise-grade encryption keeps your data safe."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="AI Powered"
              desc="Let advanced algorithms handle the heavy lifting."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black py-10 text-center text-sm text-white/40">
        © 2025 Nom.ai Inc. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-neutral-900/40 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-neutral-900/70 hover:-translate-y-1">
      <div className="mb-4 inline-flex rounded-lg bg-white/10 p-3 text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-sm text-white/60">{desc}</p>
    </div>
  );
}
