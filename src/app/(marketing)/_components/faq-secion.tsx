"use client";

import React from "react";
import { Instrument_Serif } from "next/font/google";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const serifFont = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const faqs = [
  {
    question: "Does Nom train on my codebase?",
    answer:
      "No. Your code is indexed into a private vector database solely for retrieval (RAG). We do not use your code to train our base models, and your data never leaks to other users.",
  },
  {
    question: "How secure is the meeting integration?",
    answer:
      "Nom processes audio streams in real-time and discards the raw audio immediately after transcription. Only the text context and extracted tasks are stored in your encrypted project memory.",
  },
  {
    question: "What exactly is a 'Biscuit'?",
    answer:
      "A Biscuit is a unit of compute. Indexing a repo file costs 1 Biscuit. Processing 1 minute of meeting audio costs ~0.1 Biscuits. Querying nom and chatting are free.",
  },
  {
    question: "Does it work with monorepos?",
    answer:
      "Absolutely. Nom allows you to scope context to specific folders or packages, so you don't waste tokens scanning irrelevant parts of a massive codebase.",
  },
];

export default function FAQSection() {
  return (
    <section className="relative z-10 border-t border-white/10 bg-black py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Header */}
          <div>
            <h2 className={`text-4xl md:text-5xl ${serifFont.className}`}>
              Common <br />
              Questions
            </h2>
            <p className="mt-6 text-lg font-light text-neutral-400">
              Everything you need to know about security, billing, and technical
              details.
            </p>
            <div className="mt-8">
              <a
                href="#"
                className="text-sm text-white underline underline-offset-4 opacity-60 transition-opacity hover:opacity-100"
              >
                Read the full documentation
              </a>
            </div>
          </div>

          {/* Shadcn Accordion */}
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-light text-neutral-200 hover:text-white hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed font-light text-neutral-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
