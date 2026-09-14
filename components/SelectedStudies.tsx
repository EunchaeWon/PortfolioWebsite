import Image from "next/image";
import { ProjectVideoButton } from "@/components/ProjectVideoButton";
import { ProjectGallery } from "@/components/ProjectGallery";

const studies = [
  {
    id: "guppy",
    title: "Guppy",
    meta: "2021 · Animation · 2′23″",
    image: "/projects/gallery/guppy-01.webp",
    alt: "Guppy project presentation with a sculpted figure and animation stills",
    description: "An animated self-portrait, produced independently including sound. The project documentation brings together drawings and 3D imagery.",
    tools: "Blender · Premiere · Cakewalk",
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
            <div className="study-image">
              <Image src={study.image} alt={study.alt} fill sizes="(max-width: 900px) 92vw, 44vw" loading="lazy" unoptimized />
            </div>
            <div className="study-content">
              <p className="eyebrow">{study.meta}</p>
              <h3>{study.title}</h3>
              <div className="project-links">
                {study.video && <ProjectVideoButton title={study.title} videoUrl={study.video} label="Watch · 2′23″" />}
              </div>
              <p>{study.description}</p>
              <small>{study.tools}</small>
            </div>
            <div className="study-gallery">
              <ProjectGallery
                projectTitle="Guppy"
                projectSlug="guppy"
                interactive
                items={[1, 2, 3, 4].map((number) => ({
                  src: `/projects/gallery/guppy-0${number}.webp`,
                  alt: `Guppy original project documentation, image ${number} of 4`,
                  caption: `Guppy · ${String(number).padStart(2, "0")}`,
                }))}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
