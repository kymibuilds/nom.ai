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
            Perfect for small teams, indie builders, and friends who code together.
            Nom.ai connects your repo, your conversations, your meetings, and your tasks—
            turning everything into one shared intelligence layer your team can rely on.
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
          
          {/* Card 1: Chat With Your Repo */}
          <motion.div 
            variants={item} 
            className="group relative overflow-hidden rounded-md border border-white/10 bg-white/5 p-8 md:col-span-2 hover:border-white/20 transition-colors"
          >
            <div className="relative z-10 flex flex-col h-full">
              <h3 className={`text-3xl font-medium ${serifFont.className}`}>
                Chat With Your Repo
              </h3>

              <p className="mt-4 max-w-lg text-neutral-200 leading-relaxed font-light">
                Talk to your project like it’s a teammate.
                Ask how features work, what changed, why something broke,
                or where a file lives.  
                Nom.ai pulls answers from your code, discussions, and past decisions.
              </p>
            </div>
            
            {/* Chat Visual */}
            <div className="absolute -bottom-4 right-4 w-[90%] md:w-[60%] opacity-60 transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-100">
              <div className="flex flex-col gap-3 rounded-t-md border border-white/10 bg-neutral-900/95 p-4 backdrop-blur-md shadow-2xl">
                <div className="self-end rounded-md rounded-tr-none bg-neutral-100 px-4 py-2 text-xs font-medium text-black">
                  Why is login slow for new users?
                </div>
                <div className="self-start rounded-md rounded-tl-none bg-white/10 px-4 py-2 text-xs text-neutral-300 border border-white/5">
                  <span className="mb-2 block text-[10px] text-neutral-500 font-mono uppercase">
                    Found in: /lib/auth.ts
                  </span>
                  The onboarding flow still performs a full profile sync.
                  This adds ~120ms on first login.  
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Project Memory */}
          <motion.div 
            variants={item} 
            className="group relative overflow-hidden rounded-md border border-white/10 bg-white/5 p-8 hover:border-white/20 transition-colors"
          >
            <div className="relative z-10">
              <h3 className={`text-3xl font-medium ${serifFont.className}`}>
                Project Memory
              </h3>

              <p className="mt-4 text-neutral-200 text-sm leading-relaxed font-light">
                Every meeting, idea, argument, decision, and TODO becomes
                part of a shared "ideabase" your team can search.  
                Nothing gets forgotten or buried in Discord anymore.
              </p>
            </div>
            
            {/* Visual */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute -right-4 bottom-4 flex flex-col gap-2 opacity-50 transition-all group-hover:-translate-x-2 group-hover:opacity-90">
               <div className="w-48 rounded border border-white/10 bg-neutral-900 p-3 shadow-lg">
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">
                    Meeting Summary • Yesterday
                  </div>
                  <div className="h-1 w-3/4 bg-white/20 mb-1"></div>
                  <div className="h-1 w-1/2 bg-white/20"></div>
               </div>
               <div className="ml-4 w-48 rounded border border-white/10 bg-neutral-900 p-3 shadow-lg">
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">
                    Decisions Linked to Auth/
                  </div>
                  <div className="h-1 w-2/3 bg-white/20"></div>
               </div>
            </div>
          </motion.div>

          {/* Card 3: Context Awareness */}
          <motion.div 
            variants={item} 
            className="group relative overflow-hidden rounded-md border border-white/10 bg-white/5 p-8 hover:border-white/20 transition-colors"
          >
             <div className="relative z-10">
              <h3 className={`text-3xl font-medium ${serifFont.className}`}>
                True Context
              </h3>

              <p className="mt-4 text-neutral-200 text-sm leading-relaxed font-light">
                Nom.ai understands how your project fits together.  
                Routes, APIs, components, discussions, and tasks aren’t separate anymore—
                everything is connected.  
                It thinks like someone who built the project with you.
              </p>
            </div>

            {/* Visual */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
               <div className="relative h-full w-full">
                  <div className="absolute left-[20%] top-[40%] h-1.5 w-1.5 bg-white shadow-[0_0_10px_white]" />
                  <div className="absolute right-[30%] top-[60%] h-1.5 w-1.5 bg-white shadow-[0_0_10px_white]" />
                  <div className="absolute left-[50%] bottom-[20%] h-1.5 w-1.5 bg-white shadow-[0_0_10px_white]" />
                  
                  <svg className="absolute inset-0 h-full w-full stroke-white/20 stroke-[0.5]">
                     <line x1="20%" y1="40%" x2="50%" y2="20%" />
                     <line x1="20%" y1="40%" x2="70%" y2="60%" />
                     <line x1="70%" y1="60%" x2="50%" y2="20%" />
                     <line x1="80%" y1="30%" x2="70%" y2="60%" />
                  </svg>
               </div>
            </div>
          </motion.div>

          {/* Card 4: Task Assignment */}
          <motion.div 
            variants={item} 
            className="group relative overflow-hidden rounded-md border border-white/10 bg-white/5 p-8 md:col-span-2 hover:border-white/20 transition-colors"
          >
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <h3 className={`text-3xl font-medium ${serifFont.className}`}>
                  Natural Task Assignment
                </h3>

                <p className="mt-4 max-w-md text-neutral-200 leading-relaxed font-light">
                  Assign tasks just by talking.  
                  “Can someone clean up the pricing component?” →  
                  Nom.ai creates the task, links the files, and assigns the right person.  
                  Meetings can be converted into tasks with one command.
                </p>
              </div>
            </div>

            {/* Task Visual */}
            <div className="absolute -bottom-8 right-8 w-[60%] rotate-2 opacity-60 transition-all duration-500 group-hover:-translate-y-6 group-hover:rotate-0 group-hover:opacity-100">
               <div className="rounded-md border border-white/10 bg-neutral-900 p-5 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="flex items-center gap-2 text-[10px] tracking-wider text-neutral-500 uppercase font-medium">
                      <div className="h-1.5 w-1.5 bg-white"></div>
                      TASK-2041
                    </span>
                    <span className="text-[10px] text-neutral-600 font-mono">
                      AUTO–GENERATED
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-neutral-200 font-light">
                      Refactor Pricing Component
                    </div>

                    <div className="flex items-center gap-2">
                       <span className="rounded-sm border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-neutral-400">
                          Frontend
                       </span>
                       <span className="rounded-sm border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-neutral-400">
                          High Priority
                       </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 text-[10px] text-neutral-500 border-t border-white/5">
                    Assigned via chat instruction
                  </div>
               </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
