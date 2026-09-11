import Image from "next/image";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectVideoButton } from "@/components/ProjectVideoButton";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
  idPrefix?: string;
  interactiveGallery?: boolean;
};

export function ProjectCard({ project, index, idPrefix = "", interactiveGallery = false }: ProjectCardProps) {
  const links: Array<{ label: string; href: string }> = [];
  const videos = project.videos ?? (project.videoUrl ? [{ label: "Watch", url: project.videoUrl }] : []);

  if (project.playableUrl) links.push({ label: "Play now", href: project.playableUrl });
  if (project.githubUrl) links.push({ label: "GitHub", href: project.githubUrl });
  if (project.steamUrl) links.push({ label: "Steam", href: project.steamUrl });
  if (project.itchUrl) links.push({ label: "itch.io", href: project.itchUrl });
  if (project.artworkUrl) links.push({ label: "View work", href: project.artworkUrl });

  const number = String(index + 1).padStart(2, "0");
  const projectId = `${idPrefix}${project.slug}`;

  return (
    <article
      className={`project-card project-card-swan-format project-card-${project.accent}${project.slug === "cycle" ? " project-card-cycle" : ""}${project.recognition ? " project-card-award" : ""}`}
      id={projectId}
      aria-labelledby={`${projectId}-title`}
    >
      <div className="project-media">
        <div className="project-window-bar">
          <span>{number} / {project.slug}.png</span>
          {project.recognition ? (
            <strong className="project-window-award">Winner · Best Animation</strong>
          ) : null}
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
          {project.slug !== "cycle" && <><Image
            className="project-image project-image-alt"
            src={project.gameplayMedia}
            alt={project.gameplayAlt}
            fill
            sizes="(max-width: 900px) 100vw, 62vw"
            loading="eager"
            unoptimized
          />
          <span className="media-hint" aria-hidden="true">hover / second view</span></>}
        </div>
      </div>

      <div className="project-content">
        {project.recognition ? (
          <aside className="project-recognition project-recognition-winner" aria-label="Verified festival award">
            <Image
              src={project.recognition.image}
              alt={project.recognition.imageAlt}
              width={258}
              height={258}
              sizes="112px"
              unoptimized
            />
            <div>
              <span>Winner · Verified award</span>
              <strong>{project.recognition.title}</strong>
              <p>{project.recognition.organization}</p>
              <small>{project.recognition.date}</small>
              {project.recognition.sourceUrl ? (
                <a
                  className="project-recognition-source"
                  href={project.recognition.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.recognition.sourceLabel ?? "Official source"} <b aria-hidden="true">↗</b>
                </a>
              ) : null}
            </div>
          </aside>
        ) : null}

        <div className="project-meta">
          <span>{project.developmentPeriod}</span>
          <span>{project.engine}</span>
        </div>

        <h3 id={`${projectId}-title`}>{project.title}</h3>
        <p className="project-description">{project.shortDescription}</p>

        <div className="project-overview">
          {project.overview.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <section className="project-breakdown" aria-label={`${project.title} project breakdown`}>
          {[
            ["Challenge", project.breakdown.challenge],
            ["What I built", project.breakdown.whatIBuilt],
            ["Technical implementation", project.breakdown.technicalImplementation],
            ["Result", project.breakdown.result],
          ].map(([label, detail], step) => (
            <div key={label} className="project-breakdown-step">
              <span>{String(step + 1).padStart(2, "0")}</span>
              <h4>{label}</h4>
              <p>{detail}</p>
            </div>
          ))}
        </section>

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

        {links.length > 0 || videos.length > 0 ? (
          <div className="project-links">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
            {videos.map((video) => (
              <ProjectVideoButton
                key={video.url}
                title={project.title}
                videoUrl={video.url}
                label={video.label}
              />
            ))}
          </div>
        ) : (
          <p className="project-private">Private build · Documentation available on request</p>
        )}
      </div>

      {project.gallery.length > 0 && <ProjectGallery
        projectTitle={project.title}
        projectSlug={project.slug}
        items={project.gallery}
        interactive={interactiveGallery}
      />}
    </article>
  );
}
