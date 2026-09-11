import type { Metadata } from "next";
import Link from "next/link";
import { CatCursor } from "@/components/CatCursor";
import { FloatingCharacters } from "@/components/FloatingCharacters";
import { MouseCatSprinkles } from "@/components/MouseCatSprinkles";
import { NeonCatSprinkles } from "@/components/NeonCatSprinkles";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";

const githubUrl = "https://github.com/EunchaeWon";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected games and digital works by Eunchae Won.",
};

export default function ProjectsPage() {
  return (
    <>
      <CatCursor />
      <FloatingCharacters behindProjectCards />
      <MouseCatSprinkles behindProjectCards />
      <NeonCatSprinkles behindProjectCards />

      <div className="top-navigation-track">
        <Header githubUrl={githubUrl} />
      </div>

      <main>
        <section className="projects-section" id="projects">
          <Reveal className="section-intro">
            <p className="eyebrow">Selected work / {String(projects.length).padStart(2, "0")}</p>
            <div className="section-heading-row">
              <h2>Selected Projects</h2>
              <p>
                Games and digital works developed independently from programming
                and systems to 3D art, animation, and presentation.
              </p>
            </div>
          </Reveal>

          <div className="projects-list">
            {projects.map((project, index) => (
              <Reveal key={project.slug}>
                <ProjectCard project={project} index={index} interactiveGallery />
              </Reveal>
            ))}
          </div>
        </section>
      </main>


      <footer className="projects-footer">
        <span>© 2026 Eunchae Won</span>
        <span>Designed for play · Built with Next.js</span>
        <Link href="/#top">Back to home ↑</Link>
      </footer>
    </>
  );
}
