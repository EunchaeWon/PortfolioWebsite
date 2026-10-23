import { ProjectGallery } from "@/components/ProjectGallery";

export function SamsaraProject() {
  return (
    <section className="selected-studies" id="samsara" aria-labelledby="samsara-title">
      <p className="eyebrow">New project / In development · 2026–present</p>
      <h2 id="samsara-title">SAMSARA</h2>
      <article className="study-card samsara-concept-card">
        <div className="study-content">
          <p className="eyebrow">Concept &amp; preproduction · Two-person indie project</p>
          <h3>A life disappears. Its path remains.</h3>
          <p>
            A surreal adventure concept inspired by the six realms of Buddhist samsara.
            Rebirth into different bodies is intended to change how players move,
            perceive, and explore the world.
          </p>
          <p>
            Its central design, Karma Shape, records each life’s explored path as a
            circular contour. After death, that trace joins the perimeter of an
            existing Wheel of Samsara. How these traces influence the Wheel and
            future rebirth is the next design question to test.
          </p>
          <ul className="feature-list">
            <li>Current work: game and narrative design, system proposals, and visual exploration</li>
            <li>Next prototype goal: one body, one realm, and a complete birth–life–death–return loop</li>
            <li>Engine and final visual format undecided; no playable build yet</li>
          </ul>
          <small>AI-assisted concept illustrations under creator direction—not gameplay screenshots or finished assets.</small>
        </div>
        <ProjectGallery projectTitle="SAMSARA" projectSlug="samsara" interactive items={[
          {
            src: "/projects/gallery/samsara-chamber-concept.png",
            alt: "ASCII-style concept exploration of the Chamber and Wheel of Samsara",
            caption: "The Chamber · AI-assisted concept exploration",
          },
          {
            src: "/projects/gallery/samsara-arrival-concept.png",
            alt: "Concept composition of a swimmer arriving in the Chamber through the water surface",
            caption: "Crossing the surface · AI-assisted composition draft",
          },
        ]} />
      </article>
    </section>
  );
}
