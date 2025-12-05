"use client";

import { useEffect, useState } from "react";

export default function useScroll(threshold: number = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > threshold);
    };

    handler(); // run immediately
    window.addEventListener("scroll", handler);

    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);

  return scrolled;
}
