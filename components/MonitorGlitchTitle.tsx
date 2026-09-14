"use client";

import { useEffect, useState } from "react";

const titles = [
  { label: "Welcome, Stranger,", lines: ["Welcome,", "Stranger,"], compact: false },
  {
    label: "A Strange World for Strangers",
    lines: ["A Strange World", "for", "Strangers"],
    compact: true,
  },
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
    <h1
      className={`monitor-title monitor-title-glitch${title.compact ? " monitor-title-compact" : ""}`}
      aria-label={title.label}
      key={title.label}
    >
      {title.lines.map((line) => (
        <span aria-hidden="true" key={line}>
          {line}
        </span>
      ))}
    </h1>
  );
}
