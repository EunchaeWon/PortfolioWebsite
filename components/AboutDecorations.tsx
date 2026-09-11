"use client";

import { useEffect, useRef, useState } from "react";
import { FloatingCharacters } from "@/components/FloatingCharacters";
import { MouseCatSprinkles } from "@/components/MouseCatSprinkles";
import { NeonCatSprinkles } from "@/components/NeonCatSprinkles";

export function AboutDecorations() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const about = document.getElementById("about");
    const layer = ref.current;
    if (!about || !layer) return;
    const update = () => {
      const bounds = about.getBoundingClientRect();
      const top = Math.max(0, bounds.top);
      const bottom = Math.max(0, window.innerHeight - bounds.bottom);
      const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
      setVisible(visible);
      layer.style.visibility = visible ? "visible" : "hidden";
      layer.style.clipPath = `inset(${top}px 0 ${bottom}px 0)`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = new ResizeObserver(update);
    observer.observe(about);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return <div ref={ref} className="about-decorations">
    {visible && <>
      <FloatingCharacters vanishOnClick />
      <MouseCatSprinkles />
      <NeonCatSprinkles />
    </>}
  </div>;
}
