"use client";

import React from "react";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import { Github, Heart } from "lucide-react";

const serifFont = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        {/* Brand / Copyright */}
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className={`text-2xl ${serifFont.className}`}>nom.ai</span>
          <span className="font-mono text-xs tracking-wide text-neutral-600">
            © {new Date().getFullYear()} INC.
          </span>
        </div>

        {/* Socials & Credits */}
        <div className="flex flex-col items-center gap-4 md:items-end">
          {/* Repo Link */}
          <Link
            href="https://github.com/kymibuilds/nom.ai"
            target="_blank"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-neutral-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <Github className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            <span>Star on GitHub</span>
          </Link>

          {/* Credits */}
          <div
            className={`flex items-center gap-1.5 text-sm text-neutral-500 ${serifFont.className}`}
          >
            <span>Built with</span>
            <Heart className="h-3 w-3 fill-red-500/10 text-red-500/60" />
            <span>by</span>
            <Link
              href="https://github.com/kymibuilds"
              target="_blank"
              className="text-neutral-300 underline decoration-white/10 underline-offset-4 transition-colors hover:text-white hover:decoration-white/50"
            >
              kymi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
