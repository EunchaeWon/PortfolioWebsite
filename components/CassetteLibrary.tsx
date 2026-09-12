"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectCassette } from "@/components/ProjectCassette";
import { getCassetteTitleImage } from "@/components/ProjectCassette";
import Image from "next/image";
import type { Project } from "@/data/projects";

export function CassetteLibrary({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [titleVersion, setTitleVersion] = useState(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHover = useRef<string | null>(null);
  const cancelHover = () => {
    document.dispatchEvent(new Event("portfolio:cassette-hover-end"));
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    pendingHover.current = null;
    setHoveredProject(null);
  };
  useEffect(() => {
    const cancel = () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
      pendingHover.current = null;
      setHoveredProject(null);
    };
    document.addEventListener("portfolio:cassette-insert", cancel);
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      document.removeEventListener("portfolio:cassette-insert", cancel);
    };
  }, []);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeProject = activeIndex === null ? null : projects[activeIndex];
  const featuredHoverTitle = hoveredProject && [
    "faces-within-the-wheel",
    "nowhere-now-here",
    "cycle",
  ].includes(hoveredProject.slug);
  const showCassetteTitle = (project: Project) => {
    if (hoveredProject?.slug === project.slug || pendingHover.current === project.slug || activeProject) return;
    cancelHover();
    pendingHover.current = project.slug;
    document.dispatchEvent(new CustomEvent("portfolio:cassette-title-type", {
      detail: { length: project.title.length, shortenBy: [0, 1, 5].includes(projects.findIndex(item => item.slug === project.slug)) ? 0.3 : 0 },
    }));
    hoverTimer.current = setTimeout(() => {
      hoverTimer.current = null;
      pendingHover.current = null;
      setHoveredProject(project);
      setTitleVersion((version) => version + 1);
    }, 600);
  };

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
      document.dispatchEvent(new Event("portfolio:cassette-close"));
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
            onHover={() => showCassetteTitle(project)}
            onLeave={cancelHover}
          />
        ))}
      </div>
      <p
        className={`cassette-hover-title${hoveredProject ? " is-visible" : ""}`}
        aria-live="polite"
      >
        {hoveredProject && getCassetteTitleImage(hoveredProject) ? (
          <Image
            key={titleVersion}
            className={`cassette-hover-title-image${featuredHoverTitle ? " cassette-hover-title-image--featured" : ""}`}
            src={getCassetteTitleImage(hoveredProject)!}
            alt={hoveredProject.title}
            width={421}
            height={106}
            sizes="min(72vw, 540px)"
          />
        ) : hoveredProject ? `> ${hoveredProject.title}` : ""}
      </p>

      {projectDialog && createPortal(projectDialog, document.body)}
    </>
  );
}
