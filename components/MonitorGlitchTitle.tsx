"use client";

import { useEffect, useState } from "react";

const titles = [
  { label: "Klick Here", lines: ["Klick", "Here"] },
  { label: "See a world", lines: ["See a", "world"] },
] as const;

export function MonitorGlitchTitle() {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTitleIndex((current) => (current + 1) % titles.length);
    }, 2200);

    return () => window.clearInterval(timer);
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
