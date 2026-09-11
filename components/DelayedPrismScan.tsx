"use client";

import { useEffect, useRef } from "react";

export function DelayedPrismScan() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const line = ref.current;
    const hero = line?.parentElement;
    if (!line || !hero) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let playback: Animation | undefined;
    const play = (elapsed = 0) => {
      playback?.cancel();
      if (reducedMotion.matches) return;
      playback = line.animate([
        { offset: 0, opacity: 0, transform: "translate3d(0, 105svh, 0)" },
        { offset: 0.11, opacity: 0, transform: "translate3d(0, 105svh, 0)" },
        { offset: 0.16, opacity: 0.22 },
        { offset: 0.23, opacity: 0.72 },
        { offset: 0.41, opacity: 0.48 },
        { offset: 0.5, opacity: 0, transform: "translate3d(0, -22svh, 0)" },
        { offset: 1, opacity: 0, transform: "translate3d(0, -22svh, 0)" },
      ], { duration: 18000, delay: 2000 + Math.random() * 2000 - elapsed, easing: "linear" });
    };
    const onCycle = (event: AnimationEvent) => {
      if (event.target === hero && event.pseudoElement === "::before" && event.animationName === "hero-prism-scan") play();
    };
    const original = hero.getAnimations().find(animation =>
      animation instanceof CSSAnimation && animation.animationName === "hero-prism-scan");
    play(typeof original?.currentTime === "number" ? original.currentTime % 18000 : 0);
    hero.addEventListener("animationiteration", onCycle);
    const onPreference = () => { if (reducedMotion.matches) playback?.cancel(); };
    reducedMotion.addEventListener("change", onPreference);
    return () => {
      playback?.cancel();
      hero.removeEventListener("animationiteration", onCycle);
      reducedMotion.removeEventListener("change", onPreference);
    };
  }, []);

  return <span ref={ref} className="hero-prism-scan-follow" aria-hidden="true" />;
}
