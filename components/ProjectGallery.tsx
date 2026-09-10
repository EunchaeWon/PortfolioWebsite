"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import type { ProjectGalleryItem } from "@/data/projects";

type ProjectGalleryProps = {
  projectTitle: string;
  projectSlug: string;
  items: ProjectGalleryItem[];
  interactive?: boolean;
};

export function ProjectGallery({
  projectTitle,
  projectSlug,
  items,
  interactive = false,
}: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];

  const closeLightbox = () => {
    const previousIndex = activeIndex;
    setActiveIndex(null);
    window.setTimeout(() => {
      if (previousIndex !== null) triggerRefs.current[previousIndex]?.focus();
    }, 0);
  };

  const showPrevious = () => {
    setActiveIndex((current) => current === null ? 0 : (current - 1 + items.length) % items.length);
  };

  const showNext = () => {
    setActiveIndex((current) => current === null ? 0 : (current + 1) % items.length);
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft" && items.length > 1) showPrevious();
      if (event.key === "ArrowRight" && items.length > 1) showNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, items.length]);

  return (
    <>
      <div className="project-gallery" aria-label={`${projectTitle} project gallery`}>
        {items.map((item, index) => (
          <figure key={item.src}>
            {interactive ? (
              <button
                className="project-gallery-trigger"
                type="button"
                ref={(node) => { triggerRefs.current[index] = node; }}
                onClick={() => setActiveIndex(index)}
                aria-label={`${projectTitle}: ${item.caption} 크게 보기`}
              >
                <span className="project-gallery-image">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 680px) 92vw, (max-width: 1100px) 44vw, 28vw"
                    loading="eager"
                    unoptimized
                  />
                </span>
                <span className="project-gallery-zoom" aria-hidden="true">View larger ↗</span>
              </button>
            ) : (
              <div className="project-gallery-image">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 680px) 92vw, (max-width: 1100px) 44vw, 28vw"
                  loading="eager"
                  unoptimized
                />
              </div>
            )}
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>

      {interactive && activeItem && activeIndex !== null && typeof document !== "undefined"
        ? createPortal(
            <div
              className="project-lightbox"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${projectSlug}-lightbox-title`}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeLightbox();
              }}
            >
              <div className="project-lightbox-window">
                <header className="project-lightbox-titlebar">
                  <span>{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
                  <button ref={closeButtonRef} type="button" onClick={closeLightbox} aria-label="확대 이미지 닫기">×</button>
                </header>

                <div className="project-lightbox-layout">
                  <div className="project-lightbox-image">
                    <Image
                      src={activeItem.src}
                      alt={activeItem.alt}
                      fill
                      sizes="(max-width: 760px) 94vw, 72vw"
                      priority
                      unoptimized
                    />
                  </div>

                  <div className="project-lightbox-copy">
                    <p>Project detail</p>
                    <h2 id={`${projectSlug}-lightbox-title`}>{projectTitle}</h2>
                    <strong>{activeItem.caption}</strong>
                    <span>{activeItem.alt}</span>

                    {items.length > 1 ? (
                      <div className="project-lightbox-controls">
                        <button type="button" onClick={showPrevious}>← Previous</button>
                        <button type="button" onClick={showNext}>Next →</button>
                      </div>
                    ) : null}
                    <small>Esc 키 또는 바깥 영역을 누르면 닫힙니다.</small>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
