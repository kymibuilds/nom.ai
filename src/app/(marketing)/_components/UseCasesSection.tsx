"use client";

import React from "react";
import { Instrument_Serif } from "next/font/google";

const serifFont = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function UseCasesSection() {
  return (
    <section className="relative z-10 bg-black py-32 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className={`text-3xl md:text-5xl ${serifFont.className}`}>
            Built for every team
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Nom.ai adapts to the way you work — whether you're hacking together a prototype
            or scaling a global product.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-10 md:grid-cols-3">

          {/* Hackathons */}
          <UseCaseCard
            title="For Hackathons"
            desc="Build prototypes insanely fast. Generate APIs, docs, and AI-assisted logic with almost no setup. Perfect for 24-hour build cycles."
          />

          {/* Engineering Teams */}
          <UseCaseCard
            title="For Engineering Teams"
            desc="Collaborate in real time, ship faster, and automate workflows. Nom.ai becomes an intelligent layer between your product and your codebase."
          />

          {/* Startups */}
          <UseCaseCard
            title="For Startups"
            desc="Scale without slowing down. Get analytics, deployments, and AI-powered insights all in one unified workspace."
          />

        </div>
      </div>
    </section>
  );
}

function UseCaseCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-neutral-900/30 
                    p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-neutral-900/60">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-sm text-white/60">{desc}</p>
      <div className="mt-4 flex items-center gap-1 text-white/70 group-hover:text-white">
        <span className="text-sm">Learn more</span>
      </div>
    </div>
  );
}
