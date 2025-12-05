"use client";

import React, { useState } from "react";
import { Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import useScroll from "@/hooks/use-scroll";

export const is = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const navLinks = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScroll(10); // threshold: show navbar background after 10px

  return (
    <nav
      className={
        `fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 
        ${scrolled 
          ? "border-white/10 bg-black/40 backdrop-blur-xs transition-all"   // visible when scrolling
          : "border-transparent bg-transparent"               // invisible at top
        }`
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className={`text-2xl font-black text-white transition-opacity hover:opacity-80 ${is.className}`}
        >
          nom.ai
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="flex items-center gap-4">
          <div className="hidden gap-3 md:flex">
            <SignInButton mode="modal">
              <button className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                Login
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-transform hover:scale-105 hover:bg-neutral-200">
                Get Started
              </button>
            </SignUpButton>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="text-white/90 hover:text-white md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 h-[calc(100vh-64px)] w-full border-b border-white/10 bg-black/90 backdrop-blur-xs px-6 py-8 md:hidden">
          <div className="flex flex-col gap-6 text-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-white/70 transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-px w-full bg-white/10" />

            <div className="flex flex-col gap-3">
              <SignInButton mode="modal">
                <button className="w-full rounded-full border border-white/20 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full rounded-full bg-white py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-95">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
