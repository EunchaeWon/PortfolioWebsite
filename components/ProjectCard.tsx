import Image from "next/image";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
  idPrefix?: string;
};

export function ProjectCard({ project, index, idPrefix = "" }: ProjectCardProps) {
  const links: Array<{ label: string; href: string }> = [];

  if (project.playableUrl) links.push({ label: "Play now", href: project.playableUrl });
  if (project.githubUrl) links.push({ label: "GitHub", href: project.githubUrl });
  if (project.steamUrl) links.push({ label: "Steam", href: project.steamUrl });
  if (project.itchUrl) links.push({ label: "itch.io", href: project.itchUrl });
  if (project.videoUrl) links.push({ label: "Watch", href: project.videoUrl });
  if (project.artworkUrl) links.push({ label: "View work", href: project.artworkUrl });

  const number = String(index + 1).padStart(2, "0");
  const projectId = `${idPrefix}${project.slug}`;

  return (
    <article
      className={`project-card project-card-${project.accent}`}
      id={projectId}
      aria-labelledby={`${projectId}-title`}
    >
      <div className="project-media">
        <div className="project-window-bar">
          <span>{number} / {project.slug}.png</span>
          <span aria-hidden="true">● ● ●</span>
        </div>
        <div className="project-image-stack" style={{ position: "relative" }}>
          <Image
            className="project-image project-image-main"
            src={project.thumbnail}
            alt={project.thumbnailAlt}
            fill
            sizes="(max-width: 900px) 100vw, 62vw"
            priority={index === 0}
            loading={index === 0 ? undefined : "eager"}
            unoptimized
          />
          <Image
            className="project-image project-image-alt"
            src={project.gameplayMedia}
            alt={project.gameplayAlt}
            fill
            sizes="(max-width: 900px) 100vw, 62vw"
            loading="eager"
            unoptimized
          />
          <span className="media-hint" aria-hidden="true">hover / second view</span>
        </div>
      </div>

      <div className="project-content">
        <div className="project-meta">
          <span>{project.developmentPeriod}</span>
          <span>{project.engine}</span>
        </div>

        <h3 id={`${projectId}-title`}>{project.title}</h3>
        <p className="project-description">{project.shortDescription}</p>

        <dl className="project-role">
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>

        <ul className="feature-list">
          {project.keyFeatures.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <ul className="tag-list" aria-label="Technologies">
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>

        {links.length > 0 ? (
          <div className="project-links">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="project-private">Private build · Documentation available on request</p>
        )}
      </div>
    </article>
  );
}
