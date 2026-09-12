"use client";

import { useEffect, useRef, useState } from "react";

/** Pauses the expensive texture repaint whenever its section leaves the viewport. */
export function HomeCrtNoise() {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={elementRef}
      className={`home-crt-noise${isVisible ? "" : " is-paused"}`}
      aria-hidden="true"
    />
  );
}
