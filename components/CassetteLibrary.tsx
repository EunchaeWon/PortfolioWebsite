"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectCassette } from "@/components/ProjectCassette";
import type { Project } from "@/data/projects";

export function CassetteLibrary({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeProject = activeIndex === null ? null : projects[activeIndex];

  const projectDialog = activeProject && activeIndex !== null ? (
    <div
      className="world-project-overlay cassette-project-overlay"
      data-no-photo-cat
      onClick={(event) => {
        event.stopPropagation();
        setActiveIndex(null);
      }}
    >
      <section
        className="world-project-window"
        role="dialog"
        aria-modal="true"
        aria-label={`${activeProject.title} project preview`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="world-project-titlebar">
          <span>{String(activeIndex + 1).padStart(2, "0")} / {activeProject.slug.toUpperCase()}.PNG</span>
          <button
            ref={closeButtonRef}
            type="button"
            data-no-photo-cat
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex(null);
            }}
            aria-label="Close project preview"
          >
            ×
          </button>
        </header>
        <div className="world-project-card-shell">
          <ProjectCard project={activeProject} index={activeIndex} idPrefix="cassette-modal-" />
        </div>
      </section>
    </div>
  ) : null;

  useEffect(() => {
    if (!activeProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeProject]);

  return (
    <>
      <div className="cassette-library" id="cassette-library" aria-label="Project cassette index">
        {projects.map((project, index) => (
          <ProjectCassette
            key={project.slug}
            project={project}
            index={index}
            onOpen={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {projectDialog && createPortal(projectDialog, document.body)}
    </>
  );
}
