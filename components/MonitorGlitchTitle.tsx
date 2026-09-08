"use client";

import { useEffect, useState } from "react";

const titles = [
  { label: "Solo Game Developer", lines: ["Solo Game", "Developer"] },
  { label: "Eunchae Won", lines: ["Eunchae", "Won"] },
] as const;

export function MonitorGlitchTitle() {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    let timer: number;

    const scheduleSwap = () => {
      timer = window.setTimeout(() => {
        setTitleIndex((current) => (current + 1) % titles.length);
        scheduleSwap();
      }, 1000 + Math.random() * 2000);
    };

    scheduleSwap();
    return () => window.clearTimeout(timer);
  }, []);

  const title = titles[titleIndex];

  return (
    <h1 className="monitor-title monitor-title-glitch" aria-label={title.label} key={title.label}>
      <span aria-hidden="true">{title.lines[0]}</span>
      <br aria-hidden="true" />
      <span aria-hidden="true">{title.lines[1]}</span>
    </h1>
  );
}
