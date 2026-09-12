"use client";

import { useEffect } from "react";

/** Snaps into the tape library only after its top has entered the viewport. */
export function TopToCassetteScroll() {
  useEffect(() => {
    let isTransitioning = false;
    let releaseTimer: number | undefined;
    let animationFrame = 0;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY <= 0) return;
      if (isTransitioning) {
        event.preventDefault();
        return;
      }

      const cassetteLibrary = document.getElementById("play");
      if (!cassetteLibrary) return;

      const cassetteTop = cassetteLibrary.getBoundingClientRect().top;
      const cassetteIsEnteringView = cassetteTop > 0 && cassetteTop < window.innerHeight * 0.72;
      if (!cassetteIsEnteringView) return;

      event.preventDefault();
      isTransitioning = true;
      // Sum the layout offsets through every parent, excluding reveal transforms.
      let destination = 0;
      let parent: HTMLElement | null = cassetteLibrary;
      while (parent) {
        destination += parent.offsetTop;
        parent = parent.offsetParent as HTMLElement | null;
      }
      const startY = window.scrollY;
      if (destination <= startY) {
        isTransitioning = false;
        return;
      }
      const startTime = performance.now();
      const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650;
      const advance = (now: number) => {
        const progress = duration ? Math.min((now - startTime) / duration, 1) : 1;
        const eased = 1 - Math.pow(1 - progress, 3);
        // Never send an upward position, even if another scroll input intervenes.
        window.scrollTo({ top: Math.max(window.scrollY, startY + (destination - startY) * eased), behavior: "instant" });
        if (progress < 1) animationFrame = window.requestAnimationFrame(advance);
      };
      animationFrame = window.requestAnimationFrame(advance);
      releaseTimer = window.setTimeout(() => { isTransitioning = false; }, 900);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(releaseTimer);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
