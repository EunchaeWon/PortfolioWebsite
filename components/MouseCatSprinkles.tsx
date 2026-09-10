"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type MouseSprinkle = {
  id: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  rotation: number;
  duration: number;
  size: number;
  color: string;
  glyph: string;
};

const neonColors = ["#39ffde", "#ff4db8", "#ffea38", "#9c6cff", "#47a8ff", "#ff8a2b"];

type MouseCatSprinklesProps = {
  behindProjectCards?: boolean;
};

export function MouseCatSprinkles({ behindProjectCards = false }: MouseCatSprinklesProps) {
  const [particles, setParticles] = useState<MouseSprinkle[]>([]);
  const nextId = useRef(0);
  const lastPoint = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const addParticle = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const now = performance.now();
      const last = lastPoint.current;
      const distance = Math.hypot(event.clientX - last.x, event.clientY - last.y);
      if (now - last.time < 48 && distance < 13) return;

      lastPoint.current = { x: event.clientX, y: event.clientY, time: now };
      nextId.current += 1;
      const viewportScale = Math.min(1, window.innerWidth / 1200);
      const particle: MouseSprinkle = {
        id: nextId.current,
        x: event.clientX + (Math.random() - 0.5) * 14,
        y: event.clientY + (Math.random() - 0.5) * 10,
        driftX: (Math.random() - 0.5) * 72,
        driftY: -34 - Math.random() * 62,
        rotation: (Math.random() - 0.5) * 90,
        duration: 1000 + Math.random() * 1000,
        size: (8 + Math.random() * 22) * viewportScale,
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
        glyph: "🐾︎",
      };

      setParticles((current) => [...current.slice(-41), particle]);
    };

    document.addEventListener("pointermove", addParticle, { passive: true });
    return () => document.removeEventListener("pointermove", addParticle);
  }, []);

  const removeParticle = (id: number) => {
    setParticles((current) => current.filter((particle) => particle.id !== id));
  };

  return (
    <div
      className={`mouse-cat-sprinkle-layer${behindProjectCards ? " is-behind-project-cards" : ""}`}
      aria-hidden="true"
    >
      {particles.map((particle) => {
        const style = {
          left: particle.x,
          top: particle.y,
          color: particle.color,
          fontSize: particle.size,
          animationDuration: `${particle.duration}ms`,
          "--mouse-sprinkle-x": `${particle.driftX}px`,
          "--mouse-sprinkle-y": `${particle.driftY}px`,
          "--mouse-sprinkle-rotation": `${particle.rotation}deg`,
        } as CSSProperties;

        return (
          <span
            className="mouse-cat-sprinkle"
            key={particle.id}
            style={style}
            onAnimationEnd={() => removeParticle(particle.id)}
          >
            {particle.glyph}
          </span>
        );
      })}
    </div>
  );
}
