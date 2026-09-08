"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function CatCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    if (!finePointer.matches) return;

    const root = document.documentElement;
    const cursor = cursorRef.current;
    let frame = 0;
    let jellyFrame = 0;
    let jellyTimer: number | undefined;
    let x = -40;
    let y = -40;

    root.classList.add("cat-cursor-enabled");

    const render = () => {
      if (cursor) cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = 0;
    };

    const stopJellyCycle = () => {
      if (jellyTimer !== undefined) window.clearInterval(jellyTimer);
      jellyTimer = undefined;
      jellyFrame = 0;
      cursor?.removeAttribute("data-jelly-frame");
    };

    const updateInteractiveState = (interactive: boolean, fixedProjectColor = false) => {
      if (!cursor) return;

      cursor.classList.toggle("cat-cursor-active", interactive);

      if (!interactive) {
        stopJellyCycle();
        return;
      }

      if (fixedProjectColor) {
        stopJellyCycle();
        return;
      }

      if (jellyTimer === undefined) {
        cursor.dataset.jellyFrame = String(jellyFrame);
        jellyTimer = window.setInterval(() => {
          jellyFrame = (jellyFrame + 1) % 4;
          cursor.dataset.jellyFrame = String(jellyFrame);
        }, 300);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;

      if (cursor) {
        const interactiveElement = (event.target as Element | null)?.closest(
          "a, button, summary, input, select, textarea, [role='button']",
        );
        const projectIndex = root.dataset.worldPawProject;
        const interactivePaw = projectIndex !== undefined;

        if (interactivePaw) cursor.dataset.projectJelly = projectIndex;
        else cursor.removeAttribute("data-project-jelly");

        updateInteractiveState(Boolean(interactiveElement) || interactivePaw, interactivePaw);
        cursor.classList.add("cat-cursor-visible");
      }

      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const handlePointerLeave = () => {
      cursor?.classList.remove("cat-cursor-visible", "cat-cursor-active");
      stopJellyCycle();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      root.classList.remove("cat-cursor-enabled");
      root.classList.remove("world-paw-hovered");
      delete root.dataset.worldPawProject;
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
      stopJellyCycle();
    };
  }, []);

  return (
    <div className="cat-cursor" ref={cursorRef} aria-hidden="true">
      <span className="cat-cursor-visual">
        <Image
          className="cat-cursor-paw"
          src="/characters/cat-paw.png"
          alt=""
          width={1709}
          height={2349}
          sizes="52px"
          draggable={false}
        />
        <span className="cat-cursor-jelly-glow">
          <Image className="cat-cursor-jelly-frame jelly-frame-pink" src="/characters/cat-paw-jelly-pink.png" alt="" width={1709} height={2349} sizes="52px" draggable={false} />
          <Image className="cat-cursor-jelly-frame jelly-frame-mint" src="/characters/cat-paw-jelly-mint.png" alt="" width={1709} height={2349} sizes="52px" draggable={false} />
          <Image className="cat-cursor-jelly-frame jelly-frame-yellow" src="/characters/cat-paw-jelly-yellow.png" alt="" width={1709} height={2349} sizes="52px" draggable={false} />
          <Image className="cat-cursor-jelly-frame jelly-frame-violet" src="/characters/cat-paw-jelly-violet.png" alt="" width={1709} height={2349} sizes="52px" draggable={false} />
          <span className="cat-cursor-project-jelly" />
        </span>
      </span>
    </div>
  );
}
