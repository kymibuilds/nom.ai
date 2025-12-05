"use client";

import React from "react";
import { Instrument_Serif } from "next/font/google";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const serifFont = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.2, duration: 0.8 },
  },
};

export default function UseCasesSection() {
  return (
    <section className="relative z-10 bg-black py-32 text-white">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="mb-24 max-w-3xl">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl ${serifFont.className}`}
          >
            Nom.ai gives your codebase a brain.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-neutral-300 leading-relaxed font-light"
          >
            Make it easy for anyone on your team to understand, explore, and collaborate without digging through endless files. 
            Whether you’re building with friends or jamming on a hackathon prototype, Nom.ai helps everyone stay on the same page and move faster together.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-4 md:grid-cols-3 md:grid-rows-2"
        >
          
          {/* Card 1: Chat With Your Repo (Span 2) */}
          <motion.div 
            variants={item} 
            className="group relative overflow-hidden rounded-md border border-white/10 bg-white/5 p-8 md:col-span-2 hover:border-white/20 transition-colors"
          >
            <div className="relative z-10 flex flex-col h-full">
              <h3 className={`text-3xl font-medium ${serifFont.className}`}>Chat With Your Repo</h3>
              <p className="mt-4 max-w-lg text-neutral-200 leading-relaxed font-light">
                Talk to your code like it’s part of the group. Ask about architecture, history, or weird bugs—and it answers with real context.
              </p>
            </div>
            
            {/* Visual: Mock Chat Interface (Sharper) */}
            <div className="absolute -bottom-4 right-4 w-[90%] md:w-[60%] opacity-60 transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-100">
              <div className="flex flex-col gap-3 rounded-t-md border border-white/10 bg-neutral-900/95 p-4 backdrop-blur-md shadow-2xl">
                <div className="self-end rounded-md rounded-tr-none bg-neutral-100 px-4 py-2 text-xs font-medium text-black">
                  Why does the sidebar re-render twice?
                </div>
                <div className="self-start rounded-md rounded-tl-none bg-white/10 px-4 py-2 text-xs text-neutral-300 border border-white/5">
                  <span className="mb-2 block text-[10px] text-neutral-500 font-mono tracking-wider uppercase">Trace: /components/Sidebar.tsx</span>
                  The `useAuth` hook triggers an update, followed immediately by state sync...
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Project Memory (Span 1, Row 1) */}
          <motion.div 
            variants={item} 
            className="group relative overflow-hidden rounded-md border border-white/10 bg-white/5 p-8 hover:border-white/20 transition-colors"
          >
            <div className="relative z-10">
              <h3 className={`text-3xl font-medium ${serifFont.className}`}>Project Memory</h3>
              <p className="mt-4 text-neutral-200 text-sm leading-relaxed font-light">
                Nothing is lost. Meetings become knowledge. Nom.ai listens to discussions and builds a searchable ideabase.
              </p>
            </div>
            
            {/* Visual: Sharp Cards */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute -right-4 bottom-4 flex flex-col gap-2 opacity-50 transition-all group-hover:-translate-x-2 group-hover:opacity-90">
               <div className="w-48 rounded border border-white/10 bg-neutral-900 p-3 shadow-lg">
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Meeting Notes</div>
                  <div className="h-1 w-3/4 bg-white/20 mb-1"></div>
                  <div className="h-1 w-1/2 bg-white/20"></div>
               </div>
               <div className="ml-4 w-48 rounded border border-white/10 bg-neutral-900 p-3 shadow-lg">
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Decision Log</div>
                  <div className="h-1 w-2/3 bg-white/20"></div>
               </div>
            </div>
          </motion.div>

          {/* Card 3: True Context Awareness (Span 1, Row 2) */}
          <motion.div 
            variants={item} 
            className="group relative overflow-hidden rounded-md border border-white/10 bg-white/5 p-8 hover:border-white/20 transition-colors"
          >
             <div className="relative z-10">
              <h3 className={`text-3xl font-medium ${serifFont.className}`}>True Context</h3>
              <p className="mt-4 text-neutral-200 text-sm leading-relaxed font-light">
                Nom.ai isn't a file reader; it's a system thinker. It maps how routes, APIs, and ideas fit together.
              </p>
            </div>
            {/* Visual: Thin Network Lines */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
               <div className="relative h-full w-full">
                  <div className="absolute left-[20%] top-[40%] h-1.5 w-1.5 bg-white shadow-[0_0_10px_white]" />
                  <div className="absolute right-[30%] top-[60%] h-1.5 w-1.5 bg-white shadow-[0_0_10px_white]" />
                  <div className="absolute left-[50%] bottom-[20%] h-1.5 w-1.5 bg-white shadow-[0_0_10px_white]" />
                  <div className="absolute right-[20%] top-[30%] h-1 w-1 bg-white/50" />
                  
                  <svg className="absolute inset-0 h-full w-full stroke-white/20 stroke-[0.5]">
                     <line x1="20%" y1="40%" x2="50%" y2="20%" />
                     <line x1="20%" y1="40%" x2="70%" y2="60%" />
                     <line x1="70%" y1="60%" x2="50%" y2="20%" />
                     <line x1="80%" y1="30%" x2="70%" y2="60%" />
                  </svg>
               </div>
            </div>
          </motion.div>

          {/* Card 4: Task Assignment (Span 2, Row 2) */}
          <motion.div 
            variants={item} 
            className="group relative overflow-hidden rounded-md border border-white/10 bg-white/5 p-8 md:col-span-2 hover:border-white/20 transition-colors"
          >
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <h3 className={`text-3xl font-medium ${serifFont.className}`}>Task Assignment by Voice</h3>
                <p className="mt-4 max-w-md text-neutral-200 leading-relaxed font-light">
                  Create, assign, and link tasks just by speaking. "Someone clean up the pricing component" → Nom.ai creates the task automatically. No bureaucracy.
                </p>
              </div>
            </div>

            {/* Visual: Task Ticket */}
            <div className="absolute -bottom-8 right-8 w-[60%] rotate-2 opacity-60 transition-all duration-500 group-hover:-translate-y-6 group-hover:rotate-0 group-hover:opacity-100">
               <div className="rounded-md border border-white/10 bg-neutral-900 p-5 shadow-2xl">
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="flex items-center gap-2 text-[10px] tracking-wider text-neutral-500 uppercase font-medium">
                      <div className="h-1.5 w-1.5 bg-white"></div>
                      TASK-1024
                    </span>
                    <span className="text-[10px] text-neutral-600 font-mono">JUST NOW</span>
                  </div>
                  {/* Body */}
                  <div className="space-y-3">
                    <div className="text-sm text-neutral-200 font-light">Refactor Pricing Component</div>
                    <div className="flex items-center gap-2">
                       <span className="rounded-sm border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-neutral-400">High Priority</span>
                       <span className="rounded-sm border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-neutral-400">Frontend</span>
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="mt-4 pt-3 text-[10px] text-neutral-500 border-t border-white/5">
                    Assigned to <span className="text-neutral-300">Alex</span> via Voice Command
                  </div>
               </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}