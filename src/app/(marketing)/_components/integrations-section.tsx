"use client";

import React from "react";
import { Instrument_Serif } from "next/font/google";
import { motion } from "framer-motion";

const serifFont = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function IntegrationsSection() {
  return (
    <section className="relative z-10 border-t border-white/10 bg-black py-32 text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Minimal Header */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl ${serifFont.className}`}
          >
            Powered by the best.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg font-light text-neutral-400"
          >
            We orchestrate the world&apos;s most advanced AI and data
            infrastructure to give your code true intelligence.
          </motion.p>
        </div>

        {/* Clean Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <IntegrationCard
            icon={<KestraLogo />}
            name="Kestra"
            category="Orchestration"
            desc="Automates complex data flows and indexing pipelines."
          />
          <IntegrationCard
            icon={<OumiLogo />}
            name="Oumi"
            category="Fine-Tuning"
            desc="Runs specialized open-weights models on your codebase."
          />
          <IntegrationCard
            icon={<LangChainLogo />}
            name="LangChain"
            category="Framework"
            desc="Connects LLMs to your file system and logic."
          />
          <IntegrationCard
            icon={<OpenAILogo />}
            name="OpenAI"
            category="Inference"
            desc="State-of-the-art reasoning for complex architecture."
          />
        </div>
      </div>
    </section>
  );
}

type IntegrationCardProps = {
  name: string;
  category: string;
  desc: string;
  icon: React.ReactNode;
};

function IntegrationCard({ name, category, desc, icon }: IntegrationCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-md border border-white/10 bg-black p-6 transition-colors duration-300 hover:border-white/30 hover:bg-white/5">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-8 text-neutral-400 transition-colors group-hover:text-white">
            {icon}
          </div>
          <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] tracking-wider text-neutral-500 uppercase">
            {category}
          </span>
        </div>
        <h3 className={`text-xl font-medium text-white ${serifFont.className}`}>
          {name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed font-light text-neutral-400 group-hover:text-neutral-300">
          {desc}
        </p>
      </div>
    </div>
  );
}

// --- MONOCHROME LOGOS ---

function KestraLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      <path d="M11 3L3 12L11 21" />
      <path d="M21 3L13 12L21 21" />
    </svg>
  );
}

function OpenAILogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729Z" />
    </svg>
  );
}

function LangChainLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      <path d="M7 10l5-3 5 3M7 10v6l5 3 5-3v-6" />
      <path d="M12 13v6" />
    </svg>
  );
}

function OumiLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}
