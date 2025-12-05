"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import { Menu, X, LogOut, Settings } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
  useClerk,
} from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Image from "next/image";

export const is = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const navLinks = [
  { name: "Concept", href: "#concept" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 right-0 left-0 z-50 flex justify-center transition-all duration-300 ${
          scrolled ? "pt-4" : "pt-6"
        }`}
      >
        <div
          className={`relative flex items-center justify-between transition-all duration-300 ease-in-out ${
            scrolled
              ? "w-[90%] max-w-5xl rounded-full border border-white/10 bg-black/60 px-6 py-3 shadow-2xl backdrop-blur-md"
              : "w-full max-w-7xl border-transparent bg-transparent px-8 py-4"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className={`text-xl font-medium text-white transition-opacity hover:opacity-80 ${is.className}`}
          >
            nom.ai
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-xs font-medium text-white transition-colors hover:text-neutral-300">
                  Login
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="rounded-full bg-white px-5 py-2 text-xs font-medium text-black transition-transform hover:scale-105 hover:bg-neutral-200">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>

            {/* Logged IN → Custom Dropdown */}
            <SignedIn>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 transition-transform hover:scale-105 hover:border-white/30">
                    <Image
                      src={user?.imageUrl ?? "/default-avatar.png"}
                      alt={user?.fullName ?? "User"}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-3 p-2">
                    <div className="h-8 w-8 rounded-full bg-white/10">
                      <Image
                        src={user?.imageUrl ?? "/default-avatar.png"}
                        alt={user?.fullName ?? "User"}
                        width={32}
                        height={32}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm text-white ${is.className}`}>
                        {user?.firstName ?? "User"}
                      </span>
                      <span className="max-w-[120px] truncate text-[10px] text-neutral-500">
                        {user?.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => openUserProfile()}>
                    <Settings className="mr-2 h-3.5 w-3.5" />
                    <span>Manage Account</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="text-neutral-400 hover:text-white md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed inset-x-4 top-24 z-40 rounded-2xl border border-white/10 bg-black/95 p-6 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-neutral-400 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="h-px w-full bg-white/10" />

              <div className="flex flex-col gap-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full rounded-lg border border-white/10 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5">
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full rounded-lg bg-white py-3 text-sm font-medium text-black hover:bg-neutral-200">
                      Get Started
                    </button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                    <Image
                      src={user?.imageUrl ?? "/default-avatar.png"}
                      alt={user?.fullName ?? "User"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {user?.fullName}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {user?.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => signOut()}
                    className="w-full rounded-lg border border-white/10 py-3 text-sm font-medium text-neutral-400 hover:bg-white/5 hover:text-white"
                  >
                    Sign Out
                  </button>
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
