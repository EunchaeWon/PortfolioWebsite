"use client";

import { CharacterImage as Image } from "@/components/CharacterImage";
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
  baseWidth: number;
  flip: 1 | -1;
  visible: boolean;
  duration: number;
};

const characters = [
  {
    className: "floating-robot",
    src: "/characters/flying-pixel-robot.png",
    width: 1536,
    height: 1024,
    displayWidth: 89,
    baseFacing: -1,
    orientation: "horizontal",
    edge: "any",
    delay: 1200,
  },
  {
    className: "floating-cat-mummy floating-cat-mummy-1",
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
    className: "floating-grape-cat",
    src: "/characters/grape-cat-walk.gif",
    width: 381,
    height: 480,
    displayWidth: 168,
    baseFacing: 1,
    orientation: "upright",
    edge: "any",
    delay: 1450,
  },
  {
    className: "floating-egypt-cat",
    src: "/characters/egypt-cat-portrait-idle.gif",
    width: 250,
    height: 830,
    displayWidth: 63,
    baseFacing: 1,
    orientation: "upright",
    edge: "any",
    delay: 1750,
  },
] as const;

const clickVanishCharacterIndexes = new Set([1, 2]);
const grapeCharacterIndex = characters.findIndex(
  (character) => character.className === "floating-grape-cat",
);
const clickVanishDelay = 5000;
const characterScaleViewport = 1200;

function getCharacterScale() {
  return Math.min(1, window.innerWidth / characterScaleViewport);
}

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
  movementWidth = window.innerWidth,
): Motion {
  const maxX = Math.max(24, movementWidth - displayWidth - 24);
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

function createEdgeMotion(
  displayWidth: number,
  displayHeight: number,
  baseFacing: 1 | -1,
  orientation: "horizontal" | "vertical" | "upright",
  previous: Motion | null,
  movementWidth = window.innerWidth,
): Motion {
  const margin = 10;
  const headerY = Math.min(70, Math.max(18, window.innerHeight * 0.045));
  const maxX = Math.max(margin, movementWidth - displayWidth - margin);
  const maxY = Math.max(headerY, window.innerHeight - displayHeight - margin);
  const currentX = previous?.x ?? window.innerWidth / 2 - displayWidth / 2;
  const currentY = previous?.y ?? window.innerHeight / 2 - displayHeight / 2;
  const clamp = (value: number, minimum: number, maximum: number) =>
    Math.max(minimum, Math.min(maximum, value));
  const edgeOffset = () => (Math.random() - 0.5) * Math.min(260, window.innerHeight * 0.32);
  const destinations = [
    { x: margin, y: clamp(currentY + edgeOffset(), headerY, maxY) },
    { x: maxX, y: clamp(currentY + edgeOffset(), headerY, maxY) },
    { x: clamp(currentX + edgeOffset(), margin, maxX), y: headerY },
  ];
  const destination = destinations[Math.floor(Math.random() * destinations.length)];
  const deltaX = destination.x - currentX;
  const deltaY = destination.y - currentY;
  const facing: 1 | -1 = deltaX >= 0 ? 1 : -1;
  const travelAngle = Math.atan2(deltaY, Math.max(Math.abs(deltaX), 1)) * (180 / Math.PI);
  let rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 45;

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

  return {
    x: destination.x,
    y: destination.y,
    rotation: finalRotation,
    duration: 1 + Math.random(),
    flip,
    heading,
    turnId: (previous?.turnId ?? 0) + 1,
  };
}

type FloatingCharactersProps = {
  vanishOnClick?: boolean;
  behindProjectCards?: boolean;
};

export function FloatingCharacters({
  vanishOnClick = false,
  behindProjectCards = false,
}: FloatingCharactersProps) {
  const [motions, setMotions] = useState<Array<Motion | null>>(
    characters.map(() => null),
  );
  const [grapeTrail, setGrapeTrail] = useState<TrailPoint[]>([]);
  const [orangeSpot, setOrangeSpot] = useState<AmbientSpot>({
    x: 16,
    y: 76,
    baseWidth: 74,
    flip: 1,
    visible: false,
    duration: 0,
  });
  const [hiddenCharacters, setHiddenCharacters] = useState<Set<number>>(() => new Set());
  const [orangeHidden, setOrangeHidden] = useState(false);
  const [orangePaused, setOrangePaused] = useState(false);
  const characterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const lastGrapeTrailPoint = useRef<{ turnId: number; x: number; y: number } | null>(null);
  const grapeTrailPointId = useRef(0);
  const grapeBoostTimer = useRef<number | null>(null);
  const reappearTimers = useRef<Map<string, number>>(new Map());
  const [characterScale, setCharacterScale] = useState(1);
  const [grapeBoosted, setGrapeBoosted] = useState(false);
  const [egyptBoosted, setEgyptBoosted] = useState(false);
  const egyptBoostTimer = useRef<number | null>(null);

  const boostEgyptCat = () => {
    setEgyptBoosted(true);
    if (egyptBoostTimer.current !== null) window.clearTimeout(egyptBoostTimer.current);
    egyptBoostTimer.current = window.setTimeout(() => {
      setEgyptBoosted(false);
      egyptBoostTimer.current = null;
    }, 2000);
  };

  useEffect(() => {
    const fastImage = new window.Image();
    fastImage.src = "/characters/grape-cat-walk-fast.gif";
    for (const src of ["egypt-cat-portrait-idle.gif", "egypt-cat-face-fast.gif"]) {
      const image = new window.Image();
      image.src = `/characters/${src}`;
    }
  }, []);

  useEffect(() => {
    const updateCharacterScale = () => setCharacterScale(getCharacterScale());
    updateCharacterScale();
    window.addEventListener("resize", updateCharacterScale);
    return () => window.removeEventListener("resize", updateCharacterScale);
  }, []);

  const queueReappearance = useCallback((key: string, restore: () => void) => {
    const existingTimer = reappearTimers.current.get(key);
    if (existingTimer !== undefined) window.clearTimeout(existingTimer);

    const timer = window.setTimeout(() => {
      reappearTimers.current.delete(key);
      restore();
    }, clickVanishDelay);
    reappearTimers.current.set(key, timer);
  }, []);

  const vanishCharacter = useCallback((index: number) => {
    setHiddenCharacters((current) => new Set(current).add(index));
    queueReappearance(`character-${index}`, () => {
      setHiddenCharacters((current) => {
        const next = new Set(current);
        next.delete(index);
        return next;
      });
    });
  }, [queueReappearance]);

  const vanishOrangeCat = useCallback(() => {
    setOrangeHidden(true);
    setOrangePaused(true);
    setOrangeSpot((current) => ({ ...current, visible: false, duration: 0 }));
    queueReappearance("orange-cat", () => {
      setOrangeSpot((current) => ({ ...current, visible: true, duration: 0 }));
      setOrangeHidden(false);
      setOrangePaused(false);
    });
  }, [queueReappearance]);

  useEffect(() => () => {
    reappearTimers.current.forEach((timer) => window.clearTimeout(timer));
    reappearTimers.current.clear();
    if (grapeBoostTimer.current !== null) window.clearTimeout(grapeBoostTimer.current);
  }, []);

  useEffect(() => () => {
    if (egyptBoostTimer.current !== null) window.clearTimeout(egyptBoostTimer.current);
  }, []);

  const boostGrapeCat = useCallback(() => {
    setGrapeBoosted(true);
    if (grapeBoostTimer.current !== null) window.clearTimeout(grapeBoostTimer.current);
    grapeBoostTimer.current = window.setTimeout(() => {
      setGrapeBoosted(false);
      grapeBoostTimer.current = null;
    }, 1000);
  }, []);

  const moveCharacter = useCallback((index: number) => {
    setMotions((current) =>
      current.map((motion, motionIndex) =>
        motionIndex === index
          ? createMotion(
              characters[index].displayWidth * characterScale,
              characters[index].displayWidth * characterScale * characters[index].height / characters[index].width,
              characters[index].baseFacing,
              characters[index].orientation,
              characters[index].edge,
              motion,
              characters[index].className === "floating-egypt-cat" ? window.innerWidth * 0.42 : window.innerWidth,
            )
          : motion,
      ),
    );
  }, [characterScale]);

  const moveCharacterToEdge = useCallback((index: number) => {
    setMotions((current) =>
      current.map((motion, motionIndex) =>
        motionIndex === index
          ? createEdgeMotion(
              characters[index].displayWidth * characterScale,
              characters[index].displayWidth * characterScale * characters[index].height / characters[index].width,
              characters[index].baseFacing,
              characters[index].orientation,
              motion,
              characters[index].className === "floating-egypt-cat" ? window.innerWidth * 0.42 : window.innerWidth,
            )
          : motion,
      ),
    );
  }, [characterScale]);

  useEffect(() => {
    if (orangePaused) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    let timer: number;
    let cancelled = false;
    const queueAppearance = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        const baseWidth = Math.random() < 0.48
          ? 93.5 + Math.random() * 50.5
          : 22 + Math.random() * 38;
        const width = baseWidth * characterScale;
        const height = width * 980 / 1604;
        setOrangeSpot({
          ...findOpenSpot(width, height),
          baseWidth,
          visible: true,
          duration: 0,
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
  }, [characterScale, orangePaused]);

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

  const grapeMotion = motions[grapeCharacterIndex];

  useEffect(() => {
    if (!grapeMotion) return;

    const sampleTrail = () => {
      const character = characterRefs.current[grapeCharacterIndex];
      if (!character) return;

      const rect = character.getBoundingClientRect();
      const parentRect = character.parentElement!.getBoundingClientRect();
      // Attach one ninth plus one seventh of the sprite height above its bottom.
      const matrix = new DOMMatrixReadOnly(getComputedStyle(character).transform);
      const anchorOffsetY = character.offsetHeight * (0.5 - 1 / 9 - 1 / 7);
      const x = rect.left + rect.width / 2 + matrix.c * anchorOffsetY - parentRect.left;
      const y = rect.top + rect.height / 2 + matrix.d * anchorOffsetY - parentRect.top;
      const last = lastGrapeTrailPoint.current;

      if (last?.turnId !== grapeMotion.turnId) {
        lastGrapeTrailPoint.current = null;
      } else if (Math.hypot(x - last.x, y - last.y) < 8) {
        return;
      }

      lastGrapeTrailPoint.current = { turnId: grapeMotion.turnId, x, y };
      grapeTrailPointId.current += 1;
      setGrapeTrail((current) => {
        const points = current.filter((point) => point.turnId === grapeMotion.turnId);
        points.push({
          id: grapeTrailPointId.current,
          turnId: grapeMotion.turnId,
          x,
          y,
          rotation: grapeMotion.heading,
        });
        // Include the end pixels in the 500 CSS-pixel trail length limit.
        let length = 28 * characterScale;
        let first = points.length - 1;
        while (first > 0) {
          const segment = Math.hypot(
            points[first].x - points[first - 1].x,
            points[first].y - points[first - 1].y,
          );
          if (length + segment > 500) break;
          length += segment;
          first -= 1;
        }
        return points.slice(first);
      });
    };

    sampleTrail();
    const timer = window.setInterval(sampleTrail, 45);
    return () => window.clearInterval(timer);
  }, [characterScale, grapeMotion]);

  const handleTransitionEnd = (
    index: number,
    event: TransitionEvent<HTMLSpanElement>,
  ) => {
    if (event.target === event.currentTarget && event.propertyName === "transform") {
      moveCharacter(index);
    }
  };

  const moveOrangeCatToEdge = () => {
    setOrangeSpot((current) => {
      const width = current.baseWidth * characterScale;
      const height = width * 980 / 1604;
      const maxX = Math.max(10, window.innerWidth - width - 10);
      const maxY = Math.max(70, window.innerHeight - height - 10);
      const destinations = [
        { x: 10, y: Math.max(70, Math.min(maxY, current.y)) },
        { x: maxX, y: Math.max(70, Math.min(maxY, current.y)) },
        { x: Math.max(10, Math.min(maxX, current.x)), y: 70 },
      ];
      const destination = destinations[Math.floor(Math.random() * destinations.length)];

      return {
        ...current,
        ...destination,
        flip: destination.x < current.x ? -1 : 1,
        duration: 1 + Math.random(),
      };
    });
  };

  return (
    <div
      className={`floating-character-world${behindProjectCards ? " is-behind-project-cards" : ""}`}
    >
      <div className="grape-path-trail" aria-hidden="true">
        {grapeTrail
          .filter((point) => point.turnId === grapeMotion?.turnId)
          .map((point) => (
            <span
              className="grape-trail-pixel"
              key={point.id}
              style={{
                width: 28 * characterScale,
                height: 58 * characterScale,
                transform: `translate3d(${point.x - 14 * characterScale}px, ${point.y - 29 * characterScale}px, 0) rotate(${point.rotation}deg)`,
              }}
            />
          ))}
      </div>
      {characters.map((character, index) => {
        const motion = motions[index];
        const isGrapeCat = index === grapeCharacterIndex;
        const isEgyptCat = character.className === "floating-egypt-cat";
        const egyptSource = egyptBoosted ? "/characters/egypt-cat-face-fast.gif"
          : "/characters/egypt-cat-portrait-idle.gif";
        const vanishesWhenClicked = vanishOnClick && clickVanishCharacterIndexes.has(index);
        const isClickHidden = vanishesWhenClicked && hiddenCharacters.has(index);
        const style: CSSProperties | undefined = motion
          ? {
              width: character.displayWidth * characterScale,
              transform: `translate3d(${motion.x}px, ${motion.y}px, 0) rotate(${motion.rotation}deg)`,
              transitionDuration: `${motion.duration}s, ${vanishesWhenClicked ? 900 : 280}ms`,
            }
          : { width: character.displayWidth * characterScale };

        return (
          <span
            ref={(node) => { characterRefs.current[index] = node; }}
            key={character.src}
            className={`floating-character ${character.className}${motion ? " is-roaming" : ""}${isClickHidden ? " is-click-hidden" : ""}`}
            style={style}
            onTransitionEnd={(event) => handleTransitionEnd(index, event)}
            data-no-photo-cat
            onClick={(event) => {
              event.stopPropagation();
              if (vanishesWhenClicked) {
                vanishCharacter(index);
                return;
              }
              if (isGrapeCat) {
                boostGrapeCat();
                moveCharacterToEdge(index);
                return;
              }
              moveCharacterToEdge(index);
              if (isEgyptCat) boostEgyptCat();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                if (vanishesWhenClicked) {
                  vanishCharacter(index);
                  return;
                }
                if (isGrapeCat) {
                  boostGrapeCat();
                  moveCharacterToEdge(index);
                  return;
                }
                moveCharacterToEdge(index);
                if (isEgyptCat) boostEgyptCat();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={vanishesWhenClicked ? "Hide character" : isGrapeCat ? "Speed up grape cat" : isEgyptCat ? "Speed up Egyptian cat" : "Move character to the edge of the screen"}
          >
            <Image
              key={isGrapeCat ? String(grapeBoosted) : isEgyptCat ? egyptSource : character.src}
              src={isEgyptCat ? egyptSource : isGrapeCat && grapeBoosted ? "/characters/grape-cat-walk-fast.gif" : character.src}
              alt=""
              width={character.width}
              height={character.height}
              sizes={`${character.displayWidth}px`}
              draggable={false}
              unoptimized={character.src.endsWith(".gif")}
              style={{ transform: `scaleX(${isEgyptCat ? (egyptBoosted ? -1 : 1) : motion?.flip ?? 1})` }}
            />
          </span>
        );
      })}
      <span
        className={`ambient-neon-tabby${orangeSpot.visible ? " is-visible" : ""}${vanishOnClick && orangeHidden ? " is-click-hidden" : ""}`}
        data-no-photo-cat
        role="button"
        tabIndex={orangeSpot.visible ? 0 : -1}
        aria-label={vanishOnClick ? "Hide character" : "Move character to the edge of the screen"}
        onClick={(event) => {
          event.stopPropagation();
          if (vanishOnClick) {
            vanishOrangeCat();
            return;
          }
          moveOrangeCatToEdge();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            if (vanishOnClick) {
              vanishOrangeCat();
              return;
            }
            moveOrangeCatToEdge();
          }
        }}
        style={{
          width: orangeSpot.baseWidth * characterScale,
          transform: `translate3d(${orangeSpot.x}px, ${orangeSpot.y}px, 0) scaleX(${orangeSpot.flip})`,
          "--character-click-duration": `${orangeSpot.duration}s`,
        } as CSSProperties}
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
    </div>
  );
}
