import type { ProjectModel } from "@/data/projects";
import styles from "./ProjectModels.module.css";

type ProjectModelsProps = {
  models: ProjectModel[];
  projectTitle: string;
};

export function ProjectModels({ models, projectTitle }: ProjectModelsProps) {
  if (models.length === 0) return null;

  return (
    <section className={styles.models} aria-label={`${projectTitle} 3D models`}>
      <h4 className={styles.heading}>3D models</h4>
      <ul className={styles.list}>
        {models.map((model) => (
          <li className={styles.model} key={model.url}>
            <div className={styles.details}>
              <strong>{model.name}</strong>
              <span>{model.contribution}</span>
              <small>{model.triangles.toLocaleString("en-US")} triangles · Sketchfab</small>
            </div>
            <a
              className={styles.link}
              href={model.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View 3D Model: ${model.name} on Sketchfab (opens in a new tab)`}
            >
              View 3D Model <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
