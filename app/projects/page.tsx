import type { Metadata } from "next";
import Link from "next/link";
import { CatCursor } from "@/components/CatCursor";
import { CharacterParade } from "@/components/CharacterParade";
import { FloatingCharacters } from "@/components/FloatingCharacters";
import { Header } from "@/components/Header";
import { MouseCatSprinkles } from "@/components/MouseCatSprinkles";
import { NeonCatSprinkles } from "@/components/NeonCatSprinkles";
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
      <MouseCatSprinkles behindProjectCards />
      <NeonCatSprinkles behindProjectCards />
      <FloatingCharacters behindProjectCards />

      <div className="top-navigation-track">
        <CharacterParade position="top" />
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
                <ProjectCard project={project} index={index} />
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <CharacterParade position="bottom" />

      <footer className="projects-footer">
        <span>© 2026 Eunchae Won</span>
        <span>Designed for play · Built with Next.js</span>
        <Link href="/#top">Back to home ↑</Link>
      </footer>
    </>
  );
}
