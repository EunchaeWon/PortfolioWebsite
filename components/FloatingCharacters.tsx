"use client";

import Image from "next/image";
import type { CSSProperties, TransitionEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type Motion = {
  x: number;
  y: number;
  rotation: number;
  duration: number;
  flip: 1 | -1;
  heading: number;
  turnId: number;
};

type TrailPoint = {
  id: number;
  turnId: number;
  x: number;
  y: number;
  rotation: number;
};

type AmbientSpot = {
  x: number;
  y: number;
  width: number;
  flip: 1 | -1;
  visible: boolean;
};

const characters = [
  {
    className: "floating-meme-cat",
    media: "image",
    src: "/characters/rainbow-meme-cat-no-rainbow.png",
    width: 909,
    height: 555,
    displayWidth: 120,
    baseFacing: 1,
    orientation: "horizontal",
    edge: "any",
    delay: 300,
  },
  {
    className: "floating-robot",
    media: "image",
    src: "/characters/flying-pixel-robot.png",
    width: 1536,
    height: 1024,
    displayWidth: 118,
    baseFacing: -1,
    orientation: "horizontal",
    edge: "any",
    delay: 1200,
  },
  {
    className: "floating-cat-mummy floating-cat-mummy-1",
    media: "image",
    src: "/characters/cat-mummy-new.png",
    width: 1024,
    height: 1536,
    displayWidth: 120,
    baseFacing: 1,
    orientation: "upright",
    edge: "right",
    delay: 100,
  },
  {
    className: "floating-cat-mummy floating-cat-mummy-2",
    media: "image",
    src: "/characters/cat-mummy-2.png",
    width: 1365,
    height: 2048,
    displayWidth: 120,
    baseFacing: 1,
    orientation: "upright",
    edge: "left",
    delay: 450,
  },
  {
    className: "floating-green-screen-cat",
    media: "video",
    src: "/characters/green-screen-cat.webm",
    width: 200,
    height: 200,
    displayWidth: 116,
    baseFacing: 1,
    orientation: "horizontal",
    edge: "any",
    delay: 850,
  },
  {
    className: "floating-banana-cat",
    media: "image",
    src: "/characters/banana-cat.gif",
    width: 75,
    height: 165,
    displayWidth: 76,
    baseFacing: 1,
    orientation: "upright",
    edge: "any",
    delay: 1450,
  },
] as const;

function findOpenSpot(width: number, height: number): Pick<AmbientSpot, "x" | "y" | "flip"> {
  const margin = 16;
  const top = 76;
  const maxX = Math.max(margin, window.innerWidth - width - margin);
  const maxY = Math.max(top, window.innerHeight - height - margin);
  const blocked = Array.from(
    document.querySelectorAll<HTMLElement>(
      "header, footer, a, button, summary, h1, h2, h3, p, .project-card, .play-terminal, .skills-block, .about-stats, .contact-links",
    ),
  ).map((element) => element.getBoundingClientRect());

  const candidates = Array.from({ length: 28 }, () => ({
    x: margin + Math.random() * Math.max(0, maxX - margin),
    y: top + Math.random() * Math.max(0, maxY - top),
  }));
  const overlapScore = (candidate: { x: number; y: number }) =>
    blocked.reduce((score, rect) => {
      const overlapWidth = Math.max(
        0,
        Math.min(candidate.x + width + 12, rect.right) - Math.max(candidate.x - 12, rect.left),
      );
      const overlapHeight = Math.max(
        0,
        Math.min(candidate.y + height + 12, rect.bottom) - Math.max(candidate.y - 12, rect.top),
      );
      return score + overlapWidth * overlapHeight;
    }, 0);
  const position = candidates.reduce((best, candidate) =>
    overlapScore(candidate) < overlapScore(best) ? candidate : best,
  );

  return { ...position, flip: Math.random() < 0.5 ? -1 : 1 };
}

function createMotion(
  displayWidth: number,
  displayHeight: number,
  baseFacing: 1 | -1,
  orientation: "horizontal" | "vertical" | "upright",
  edge: "any" | "left" | "right",
  previous: Motion | null,
): Motion {
  const maxX = Math.max(24, window.innerWidth - displayWidth - 24);
  const maxY = Math.max(110, window.innerHeight - displayHeight - 24);
  let x = 18 + Math.random() * (maxX - 18);
  let y = 82 + Math.random() * (maxY - 82);
  let keepsDirection = false;

  if (edge !== "any") {
    const edgeRange = Math.min(90, Math.max(24, window.innerWidth * 0.08));
    x = edge === "left"
      ? 12 + Math.random() * edgeRange
      : Math.max(12, maxX - edgeRange + Math.random() * edgeRange);
  }

  // The photo cat keeps travelling from its rainbow toward its head.
  // It only chooses a new heading occasionally (or when it reaches an edge).
  if (orientation === "vertical" && previous && Math.random() > 0.06) {
    const travelRadians = (previous.rotation - 45) * (Math.PI / 180);
    const distance = 160 + Math.random() * 260;
    const nextX = previous.x + Math.cos(travelRadians) * distance;
    const nextY = previous.y + Math.sin(travelRadians) * distance;

    if (nextX >= 18 && nextX <= maxX && nextY >= 82 && nextY <= maxY) {
      x = nextX;
      y = nextY;
      keepsDirection = true;
    }
  }

  const startX = orientation === "vertical" ? window.innerWidth / 2 - displayWidth / 2 : 0;
  const startY = orientation === "vertical" ? window.innerHeight + 30 : 82;
  const deltaX = x - (previous?.x ?? startX);
  const deltaY = y - (previous?.y ?? startY);
  const facing: 1 | -1 = deltaX >= 0 ? 1 : -1;
  const travelAngle = Math.atan2(deltaY, Math.max(Math.abs(deltaX), 1)) * (180 / Math.PI);
  let rotation = keepsDirection
    ? previous!.rotation
    : Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 45;

  if (orientation === "vertical" && previous) {
    while (rotation - previous.rotation > 180) rotation -= 360;
    while (rotation - previous.rotation < -180) rotation += 360;
  }

  const finalRotation =
    orientation === "vertical"
      ? rotation
      : orientation === "upright"
        ? Math.max(-3, Math.min(3, travelAngle * 0.08))
      : facing * Math.max(-70, Math.min(70, travelAngle));
  const flip = orientation === "vertical" || facing === baseFacing ? 1 : -1;
  const heading =
    orientation === "vertical"
      ? finalRotation - 45
      : facing === 1
        ? finalRotation
        : 180 - finalRotation;
  const headingChange = previous
    ? Math.abs(((heading - previous.heading + 540) % 360) - 180)
    : 180;

  return {
    x,
    y,
    rotation: finalRotation,
    duration: 7 + Math.random() * 6,
    flip,
    heading,
    turnId: previous ? previous.turnId + (headingChange > 8 ? 1 : 0) : 1,
  };
}

export function FloatingCharacters() {
  const [motions, setMotions] = useState<Array<Motion | null>>(
    characters.map(() => null),
  );
  const [memeTrail, setMemeTrail] = useState<TrailPoint[]>([]);
  const [showPhotoCat, setShowPhotoCat] = useState(false);
  const [photoCatRun, setPhotoCatRun] = useState(0);
  const [orangeSpot, setOrangeSpot] = useState<AmbientSpot>({
    x: 16,
    y: 76,
    width: 148,
    flip: 1,
    visible: false,
  });
  const characterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const lastTrailPoint = useRef<{ turnId: number; x: number; y: number } | null>(null);
  const trailPointId = useRef(0);
  const photoCatTimer = useRef<number | null>(null);

  const moveCharacter = useCallback((index: number) => {
    setMotions((current) =>
      current.map((motion, motionIndex) =>
        motionIndex === index
          ? createMotion(
              characters[index].displayWidth,
              characters[index].displayWidth * characters[index].height / characters[index].width,
              characters[index].baseFacing,
              characters[index].orientation,
              characters[index].edge,
              motion,
            )
          : motion,
      ),
    );
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    let timer: number;
    let cancelled = false;
    const queueAppearance = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        const aspectHeight = 980 / 1604;
        const maxWidth = Math.max(
          88,
          Math.min(720, window.innerWidth * 0.82, (window.innerHeight - 92) / aspectHeight) * 0.4,
        );
        const width = Math.random() < 0.48
          ? maxWidth * (0.65 + Math.random() * 0.35)
          : Math.min(maxWidth, 44 + Math.random() * 76);
        const height = width * 980 / 1604;
        setOrangeSpot({
          ...findOpenSpot(width, height),
          width,
          visible: true,
        });
        timer = window.setTimeout(() => {
          setOrangeSpot((current) => ({ ...current, visible: false }));
          queueAppearance();
        }, 1800 + Math.random() * 1700);
      }, 900 + Math.random() * 3200);
    };

    queueAppearance();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const timers = characters.map((character, index) =>
      window.setTimeout(
        () => moveCharacter(index),
        character.delay + Math.random() * 300,
      ),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [moveCharacter]);

  useEffect(() => {
    const revealPhotoCat = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("button, a[href], summary")) return;
      if (target.closest("[data-no-photo-cat], .project-cassette, .cassette-project-overlay")) return;

      setPhotoCatRun((current) => current + 1);
      setShowPhotoCat(true);
      if (photoCatTimer.current !== null) window.clearTimeout(photoCatTimer.current);
      photoCatTimer.current = window.setTimeout(
        () => setShowPhotoCat(false),
        1700,
      );
    };

    document.addEventListener("click", revealPhotoCat);
    return () => {
      document.removeEventListener("click", revealPhotoCat);
      if (photoCatTimer.current !== null) window.clearTimeout(photoCatTimer.current);
    };
  }, []);

  const memeMotion = motions[0];

  useEffect(() => {
    if (!memeMotion) return;

    const sampleTrail = () => {
      const character = characterRefs.current[0];
      if (!character) return;

      const rect = character.getBoundingClientRect();
      const spriteWidth = character.offsetWidth;
      const spriteHeight = character.offsetHeight;
      if (!spriteWidth || !spriteHeight) return;

      // This is the actual tail/toast junction in the source sprite. Transform
      // that point with the image flip and outer rotation so the first rainbow
      // pixel remains attached even while the cat turns.
      const tailRatioX = memeMotion.flip === 1 ? 0.23 : 0.77;
      const localX = spriteWidth * tailRatioX - spriteWidth / 2;
      const localY = spriteHeight * 0.55 - spriteHeight / 2;
      const rotationRadians = memeMotion.rotation * (Math.PI / 180);
      const anchorX =
        rect.left + rect.width / 2
        + localX * Math.cos(rotationRadians)
        - localY * Math.sin(rotationRadians);
      const anchorY =
        rect.top + rect.height / 2
        + localX * Math.sin(rotationRadians)
        + localY * Math.cos(rotationRadians);
      const x = Math.round(anchorX / 6) * 6;
      const y = Math.round(anchorY / 6) * 6;
      const last = lastTrailPoint.current;

      if (last?.turnId !== memeMotion.turnId) {
        lastTrailPoint.current = null;
      } else if (Math.hypot(x - last.x, y - last.y) < 8) {
        return;
      }

      lastTrailPoint.current = { turnId: memeMotion.turnId, x, y };
      trailPointId.current += 1;
      setMemeTrail((current) => [
        ...current.slice(-139),
        { id: trailPointId.current, turnId: memeMotion.turnId, x, y, rotation: memeMotion.heading },
      ]);
    };

    sampleTrail();
    const timer = window.setInterval(sampleTrail, 45);
    return () => window.clearInterval(timer);
  }, [memeMotion]);

  const handleTransitionEnd = (
    index: number,
    event: TransitionEvent<HTMLSpanElement>,
  ) => {
    if (event.target === event.currentTarget && event.propertyName === "transform") {
      moveCharacter(index);
    }
  };

  const playRotatingCat = (index: number) => {
    const video = characterRefs.current[index]?.querySelector("video");
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    void video.play();
  };

  return (
    <div className="floating-character-world">
      <div className="meme-path-trail" aria-hidden="true">
        {memeTrail
          .filter((point) => point.turnId === memeMotion?.turnId)
          .map((point) => (
            <span
              className="meme-trail-pixel"
              key={point.id}
              style={{
                transform: `translate3d(${point.x - 14}px, ${point.y - 29}px, 0) rotate(${point.rotation}deg)`,
              }}
            />
          ))}
      </div>
      {characters.map((character, index) => {
        const motion = motions[index];
        const isRotatingCat = character.className === "floating-green-screen-cat";
        const style: CSSProperties | undefined = motion
          ? {
              width: character.displayWidth,
              transform: `translate3d(${motion.x}px, ${motion.y}px, 0) rotate(${motion.rotation}deg)`,
              transitionDuration: `${motion.duration}s, 280ms`,
            }
          : { width: character.displayWidth };

        return (
          <span
            ref={(node) => { characterRefs.current[index] = node; }}
            key={character.src}
            className={`floating-character ${character.className}${motion ? " is-roaming" : ""}`}
            style={style}
            onTransitionEnd={(event) => handleTransitionEnd(index, event)}
            onClick={isRotatingCat ? () => playRotatingCat(index) : undefined}
            onKeyDown={isRotatingCat
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    playRotatingCat(index);
                  }
                }
              : undefined}
            role={isRotatingCat ? "button" : undefined}
            tabIndex={isRotatingCat ? 0 : undefined}
            aria-label={isRotatingCat ? "회전하는 고양이 재생" : undefined}
            aria-hidden={isRotatingCat ? undefined : true}
          >
            {character.media === "video" ? (
              <video
                src={character.src}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                onEnded={(event) => { event.currentTarget.currentTime = 0; }}
                style={{ transform: `scaleX(${motion?.flip ?? 1})` }}
              />
            ) : (
              <Image
                src={character.src}
                alt=""
                width={character.width}
                height={character.height}
                sizes={`${character.displayWidth}px`}
                draggable={false}
                unoptimized={character.src.endsWith(".gif")}
                style={{ transform: `scaleX(${motion?.flip ?? 1})` }}
              />
            )}
          </span>
        );
      })}
      <span
        className={`ambient-neon-tabby${orangeSpot.visible ? " is-visible" : ""}`}
        style={{
          width: orangeSpot.width,
          transform: `translate3d(${orangeSpot.x}px, ${orangeSpot.y}px, 0) scaleX(${orangeSpot.flip})`,
        }}
      >
        <Image
          src="/characters/neon-orange-tabby.png"
          alt=""
          width={1604}
          height={980}
          sizes="148px"
          draggable={false}
        />
      </span>
      <span
        key={photoCatRun}
        className={`static-rainbow-cat${showPhotoCat ? " is-visible" : ""}`}
      >
        <Image
          src="/characters/rainbow-light-cat-final.png"
          alt=""
          width={1709}
          height={2349}
          sizes="(max-width: 680px) 58vw, 448px"
          draggable={false}
          priority
        />
      </span>
    </div>
  );
}
