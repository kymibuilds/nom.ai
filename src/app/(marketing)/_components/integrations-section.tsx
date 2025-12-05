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
            We orchestrate the world's most advanced AI and data infrastructure
            to give your code true intelligence.
          </motion.p>
        </div>

        {/* Clean Grid - No Animations/Scaling */}
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

function IntegrationCard({ name, category, desc, icon }: any) {
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
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729ZM12.7146 0c.2258.0076.4497.027.6713.0571A5.999 5.999 0 0 1 12.7146 0Zm-5.3429 2.503a.596.596 0 0 0 .041.0163l.0062.0024.0083.0033a3.52 3.52 0 0 0 .2854.1167c.1895.074.4557.173.7842.2783.6572.2106 1.5746.4258 2.6288.4258 1.0543 0 1.9717-.2152 2.6289-.4258.3285-.1053.5947-.2043.7842-.2783a3.535 3.535 0 0 0 .2924-.12l.016-.0067.0016-.0008A5.9943 5.9943 0 0 0 7.3717 2.503Zm-5.1884 5.512c.005-.2262.019-.451.042-.6736A6.0232 6.0232 0 0 1 2.1833 8.015ZM2.503 16.6283a.5962.5962 0 0 0-.0163-.041l-.0024-.0062-.0033-.0083a3.5197 3.5197 0 0 0-.1167-.2854c-.074-.1895-.173-.4557-.2783-.7842-.2106-.6572-.4258-1.5746-.4258-2.6288 0-1.0543.2152-1.9717.4258-2.6289.1053-.3285.2043-.5947.2783-.7842a3.5354 3.5354 0 0 0 .12-.2924l.0067-.016.0008-.0016A5.9943 5.9943 0 0 0 2.503 16.6283ZM8.015 21.8167c.2262-.005.451-.019.6736-.042A6.0232 6.0232 0 0 1 8.015 21.8167Zm8.6133-.3197a.5962.5962 0 0 0 .0163.041l.0024.0062.0033.0083c.0366.091.076.1873.1167.2854.074.1895.173.4557.2783.7842.2106.6572.4258 1.5746.4258 2.6288 0 1.0543-.2152 1.9717-.4258 2.6289-.1053.3285-.2043.5947-.2783.7842a3.5354 3.5354 0 0 0-.12.2924l-.0067.016-.0008.0016A5.9943 5.9943 0 0 0 16.6283 21.497Z" />
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
