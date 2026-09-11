"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type ProjectVideoButtonProps = {
  title: string;
  videoUrl: string;
  label?: string;
};

function parseTimeToSeconds(value: string | null) {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!match) return 0;

  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
}

function getYouTubeEmbedUrl(videoUrl: string) {
  try {
    const url = new URL(videoUrl);
    const host = url.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") ?? "";
      } else {
        const parts = url.pathname.split("/").filter(Boolean);
        const routeType = parts[0] ?? "";
        if (["embed", "shorts", "live"].includes(routeType)) videoId = parts[1] ?? "";
      }
    }

    if (!/^[A-Za-z0-9_-]{6,}$/.test(videoId)) return null;

    const start = parseTimeToSeconds(url.searchParams.get("start") ?? url.searchParams.get("t"));
    const params = new URLSearchParams({ autoplay: "1", rel: "0" });
    if (start > 0) params.set("start", String(start));

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  } catch {
    return null;
  }
}

export function ProjectVideoButton({ title, videoUrl, label = "Watch" }: ProjectVideoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  const closeVideo = useCallback(() => {
    setIsOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeVideo();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeVideo, isOpen]);

  if (!embedUrl) return null;

  return (
    <>
      <button
        ref={triggerRef}
        className="project-video-trigger"
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
      >
        {label} <span aria-hidden="true">▶</span>
      </button>

      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              className="project-video-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeVideo();
              }}
            >
              <div className="project-video-window">
                <header className="project-video-titlebar">
                  <span id={titleId}>{title} / {label}</span>
                  <button ref={closeButtonRef} type="button" onClick={closeVideo} aria-label={`Close ${title} video`}>
                    ×
                  </button>
                </header>
                <div className="project-video-frame">
                  <iframe
                    src={embedUrl}
                    title={`${title} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <p className="project-video-help">Press Esc or click outside to close.</p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
