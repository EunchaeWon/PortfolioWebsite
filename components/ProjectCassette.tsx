"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import type { Project } from "@/data/projects";

export function ProjectCassette({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const cassetteTitleImage = {
    "nowhere-now-here": "/projects/nowhere-now-here-cassette-title.png",
    "swan-in-lake": "/projects/swan-in-lake-cassette-title.png",
    "faces-within-the-wheel": "/projects/faces-within-the-wheel-cassette-title.png",
    "in-the-forest": "/projects/in-the-forest-cassette-title-v2.png",
    cycle: "/projects/cycle-cassette-title.png",
    "hopeless-butterfly": "/projects/hopeless-butterfly-cassette-title.png",
  }[project.slug];

  const openProject = () => {
    onOpen();
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const link = event.currentTarget;

    if (document.documentElement.dataset.cassetteAnimating === "true") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.dispatchEvent(new Event("portfolio:cassette-insert"));
      openProject();
      return;
    }

    const cassette = link.querySelector<HTMLElement>(".cassette-case");
    const player = document.querySelector<HTMLElement>(".cassette-player-original img");
    if (!cassette || !player) {
      document.dispatchEvent(new Event("portfolio:cassette-insert"));
      openProject();
      return;
    }

    document.documentElement.dataset.cassetteAnimating = "true";
    link.classList.add("is-loading");

    const sourceRect = cassette.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    // The replacement recorder artwork has transparent canvas space on its
    // left. These coordinates land on the visible recorder's upper-left deck,
    // rather than the centre of that full transparent canvas.
    const destinationX = playerRect.left + playerRect.width * 0.485;
    const destinationY = playerRect.top + playerRect.height * 0.2;
    const deltaX = destinationX - (sourceRect.left + sourceRect.width / 2);
    const deltaY = destinationY - (sourceRect.top + sourceRect.height / 2);
    const flight = cassette.cloneNode(true) as HTMLElement;

    flight.classList.add("cassette-flight");
    Object.assign(flight.style, {
      left: `${sourceRect.left}px`,
      top: `${sourceRect.top}px`,
      width: `${sourceRect.width}px`,
      height: `${sourceRect.height}px`,
    });
    document.body.appendChild(flight);

    const animation = flight.animate(
      [
        { offset: 0, opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", easing: "cubic-bezier(0.22, 0.72, 0.18, 1)" },
        { offset: 0.2, opacity: 1, transform: "translate3d(0, -14px, 0) scale(1.1)", easing: "cubic-bezier(0.22, 0.72, 0.18, 1)" },
        { offset: 0.5, opacity: 1, transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.1)`, easing: "cubic-bezier(0.22, 0.72, 0.18, 1)" },
        { offset: 0.8, opacity: 1, transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.25)`, easing: "cubic-bezier(0.22, 0.72, 0.18, 1)" },
        { offset: 1, opacity: 0, transform: `translate3d(${deltaX}px, ${deltaY + playerRect.height * 0.34}px, 0) scale(0.25)` },
      ],
      { duration: 5000, easing: "linear", fill: "forwards" },
    );

    let frame = 0;
    let finished = false;
    const syncAudio = (event: Event) => {
      const timing = (event as CustomEvent<{ resumeAt: number; duration: number; elapsed: () => number }>).detail;
      const effect = animation.effect as KeyframeEffect;
      const frames = effect.getKeyframes();
      frames[1].offset = (timing.resumeAt * 0.18) / timing.duration;
      frames[2].offset = (timing.resumeAt * 0.6) / timing.duration;
      frames[3].offset = timing.resumeAt / timing.duration;
      // Avoid easing to a standstill at every intermediate pose.
      frames[0].easing = "cubic-bezier(0.3, 0, 0.7, 1)";
      frames[1].easing = "linear";
      frames[2].easing = "linear";
      frames[3].easing = "ease-out";
      effect.setKeyframes(frames);
      effect.updateTiming({ duration: timing.duration * 1000 });
      animation.pause();
      const tick = () => {
        if (finished) return;
        const elapsed = timing.elapsed();
        animation.currentTime = Math.min(elapsed, timing.duration) * 1000;
        if (elapsed >= timing.duration) finish();
        else frame = requestAnimationFrame(tick);
      };
      tick();
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("portfolio:cassette-timing", syncAudio);
      flight.remove();
      link.classList.remove("is-loading");
      delete document.documentElement.dataset.cassetteAnimating;
      openProject();
    };

    animation.finished.then(finish, finish);
    document.addEventListener("portfolio:cassette-timing", syncAudio, { once: true });
    document.dispatchEvent(new Event("portfolio:cassette-insert"));
  };

  return (
    <a
      className={`project-cassette project-cassette-${index % 6}`}
      href={`#${project.slug}`}
      aria-label={`Open ${project.title} project`}
      data-no-photo-cat
      onClick={handleClick}
    >
      <span className="cassette-case">
        <Image
          className="cassette-photo"
          src={`/frames/cassettes/cassette-clean-${index + 1}.png`}
          alt=""
          fill
          sizes="(max-width: 680px) 90vw, (max-width: 900px) 44vw, 28vw"
        />
        <span className={`cassette-project-label${cassetteTitleImage ? ` cassette-project-label--art cassette-project-label--${project.slug}` : ""}`}>
          {cassetteTitleImage ? (
            <Image
              className="cassette-project-art"
              src={cassetteTitleImage}
              alt={project.title}
              fill
              sizes="(max-width: 680px) 60vw, 20vw"
            />
          ) : (
            <strong>{project.title}</strong>
          )}
        </span>
      </span>
    </a>
  );
}
