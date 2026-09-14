import Image from "next/image";
import { ProjectVideoButton } from "@/components/ProjectVideoButton";

const studies = [
  {
    id: "guppy",
    title: "Guppy",
    meta: "2021 · Animation · 2′23″",
    image: "https://cdna.artstation.com/p/assets/images/images/092/586/476/large/eunchae-nj-won-eunchaewoncv-13.webp?1760052708",
    alt: "Guppy project presentation with a sculpted figure and animation stills",
    description: "An animated self-portrait, produced independently including sound. The project documentation brings together drawings and 3D imagery.",
    tools: "Blender · Premiere · Cakewalk",
    source: "https://www.artstation.com/artwork/dKA9qw",
    video: "https://www.youtube.com/watch?v=WX8hlXYBFEU",
  },
];

export function SelectedStudies() {
  return (
    <section className="selected-studies" id="animation-studies" aria-labelledby="studies-title">
      <p className="eyebrow">Selected animation / 01</p>
      <h2 id="studies-title">Animation &amp; Process</h2>
      <div className="selected-studies-grid">
        {studies.map((study) => (
          <article className="study-card" id={study.id} key={study.id}>
            <a className="study-image" href={study.source} target="_blank" rel="noreferrer" aria-label={`View ${study.title} on ArtStation`}>
              <Image src={study.image} alt={study.alt} fill sizes="(max-width: 900px) 92vw, 44vw" loading="lazy" unoptimized />
            </a>
            <div className="study-content">
              <p className="eyebrow">{study.meta}</p>
              <h3>{study.title}</h3>
              <div className="project-links">
                {study.video && <ProjectVideoButton title={study.title} videoUrl={study.video} label="Watch · 2′23″" />}
                <a href={study.source} target="_blank" rel="noreferrer">ArtStation ↗</a>
              </div>
              <p>{study.description}</p>
              <small>{study.tools}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
