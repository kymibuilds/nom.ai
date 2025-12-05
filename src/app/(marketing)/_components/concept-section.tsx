"use client";

import React from "react";
import { Instrument_Serif } from "next/font/google";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const serifFont = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function ConceptSection() {
  return (
    <section className="relative z-10 border-t border-white/10 bg-black py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: The Narrative */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs tracking-wide text-neutral-300"
            >
              <Activity className="h-3 w-3 text-white" />
              <span>SYSTEM_IDENTITY</span>
            </motion.div>

            <h2
              className={`mt-6 text-4xl md:text-5xl ${serifFont.className} leading-tight`}
            >
              Your codebase, <br />
              <span className="text-neutral-500">turned agent.</span>
            </h2>

            <div className="mt-8 space-y-6 text-lg leading-relaxed font-light text-neutral-400">
              <p>
                Tools usually live in silos. Your code is in GitHub, your
                decisions are in Slack, and your tasks are in Linear.
              </p>
              <p>
                <strong className="font-medium text-white">
                  Nom bridges them all.
                </strong>{" "}
                It’s an autonomous agent that maintains a living mental model of
                your entire project.
              </p>
              <p>
                {"It doesn't just read files; it understands "}
                <span className="text-white">architecture</span>
                {"."} {"It doesn't just record audio; it extracts "}
                <span className="text-white">context</span>
                {" from meetings to assign work intelligently."}
              </p>
            </div>
          </div>

          {/* Right: The Visual Loop (Refined Terminal) */}
          <div className="relative">
            {/* The Agent Terminal */}
            <div className="relative z-10 overflow-hidden rounded-md border border-white/10 bg-black shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                    nom_agent_core
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-green-500">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                  ONLINE
                </div>
              </div>

              {/* Terminal Body */}
              <div className="space-y-6 bg-black/50 p-6 font-mono text-xs backdrop-blur-sm md:text-sm">
                {/* Log Entry 1: Ingest */}
                <div className="relative border-l border-white/10 pl-4">
                  <div className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full border border-white/20 bg-neutral-800" />
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-neutral-500">
                    <span>10:42:05</span>
                    <span className="text-blue-400">INFO</span>
                  </div>
                  <div className="text-neutral-300">
                    Scanning repository structure...
                  </div>
                  <div className="mt-1 text-[11px] text-neutral-500">
                    → Mapped 142 files
                    <br />→ Identified dependency:{" "}
                    <span className="text-white/40">auth_flow</span>
                  </div>
                </div>

                {/* Log Entry 2: Context */}
                <div className="relative border-l border-white/10 pl-4">
                  <div className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full border border-white/20 bg-neutral-800" />
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-neutral-500">
                    <span>10:42:08</span>
                    <span className="text-yellow-400">INPUT</span>
                  </div>
                  <div className="text-neutral-300">
                    {'Processing audio stream: "Weekly Sync"'}
                  </div>
                  <div className="mt-2 rounded-sm border border-white/5 bg-white/5 p-2 text-[11px] text-neutral-400 italic">
                    {
                      '"Sam mentioned refactoring the pricing component by Friday."'
                    }
                  </div>
                </div>

                {/* Log Entry 3: Action (Highlighted) */}
                <div className="relative border-l border-white/10 pl-4">
                  <div className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 animate-pulse rounded-full border border-green-500 bg-green-900" />
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-neutral-500">
                    <span>10:42:09</span>
                    <span className="text-green-400">ACTION</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-neutral-200">
                      Triggered workflow:{" "}
                      <span className="text-green-400">create_task</span>
                    </span>

                    <div className="rounded-sm border border-white/10 bg-white/5 p-3">
                      <div className="mb-2 flex items-start justify-between">
                        <span className="font-medium text-white">
                          Refactor Pricing
                        </span>
                        <span className="rounded-sm bg-blue-500/20 px-1.5 py-0.5 text-[10px] text-blue-300">
                          LINEAR-129
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-500">
                        <div>
                          <span className="block tracking-wider text-neutral-600 uppercase">
                            Assignee
                          </span>
                          <span className="text-neutral-300">@Sam</span>
                        </div>
                        <div>
                          <span className="block tracking-wider text-neutral-600 uppercase">
                            Due
                          </span>
                          <span className="text-neutral-300">Friday</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal Footer */}
              <div className="flex items-center gap-2 border-t border-white/10 bg-white/5 px-4 py-2">
                <span className="text-green-500">➜</span>
                <span className="animate-pulse text-xs text-neutral-500">
                  Waiting for input...
                </span>
              </div>
            </div>

            {/* Decorative Glow (Subtler) */}
            <div className="absolute -top-10 -right-10 -z-10 h-40 w-40 rounded-full bg-white/5 blur-[60px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
