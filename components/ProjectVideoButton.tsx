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
    const params = new URLSearchParams({ autoplay: "0", controls: "1", playsinline: "1", rel: "0", enablejsapi: "1" });
    if (start > 0) params.set("start", String(start));

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  } catch {
    return null;
  }
}

export function ProjectVideoButton({ title, videoUrl, label = "Watch" }: ProjectVideoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [playerRevision, setPlayerRevision] = useState(0);
  const [playerStatus, setPlayerStatus] = useState("Loading YouTube player…");
  const playerRef = useRef<HTMLIFrameElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  useEffect(() => {
    if (!isOpen) return;
    setPlayerStatus("Loading YouTube player…");
    let ready = false;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com" || event.source !== playerRef.current?.contentWindow) return;
      let message;
      try { message = typeof event.data === "string" ? JSON.parse(event.data) : event.data; } catch { return; }
      if (message?.event === "onReady" || message?.event === "infoDelivery") {
        ready = true;
        setPlayerStatus("Use the YouTube player controls to start.");
      }
      if (message?.info?.playerState === 1 || (message?.event === "onStateChange" && message.info === 1)) setPlayerStatus("Playing");
      if (message?.event === "onError") setPlayerStatus("YouTube could not play this video in this browser. Try opening this portfolio in Chrome or Edge.");
    };
    window.addEventListener("message", onMessage);
    const timer = window.setTimeout(() => {
      if (!ready) setPlayerStatus("YouTube is not responding. Try Reload player, or open this portfolio in Chrome or Edge.");
    }, 12000);
    return () => { window.clearTimeout(timer); window.removeEventListener("message", onMessage); };
  }, [isOpen, playerRevision]);

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
                    ref={playerRef}
                    key={playerRevision}
                    src={embedUrl}
                    onLoad={() => playerRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: titleId }), "https://www.youtube.com")}
                    title={`${title} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                <div className="project-video-help">
                  <span role="status">{playerStatus}</span>
                  <button type="button" onClick={() => setPlayerRevision((revision) => revision + 1)}>Reload player</button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
