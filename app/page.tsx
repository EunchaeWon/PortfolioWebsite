import Image from "next/image";
import { MonitorStatic } from "@/components/MonitorStatic";
import { DelayedPrismScan } from "@/components/DelayedPrismScan";
import { CatCursor } from "@/components/CatCursor";
import { CassetteLibrary } from "@/components/CassetteLibrary";
import { AboutDecorations } from "@/components/AboutDecorations";
import { Header } from "@/components/Header";
import { MonitorGlitchTitle } from "@/components/MonitorGlitchTitle";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";

const links = {
  github: "https://github.com/EunchaeWon",
  itch: "https://eunchaewon.itch.io",
  email: "mailto:artiwon821@gmail.com",
};

const skills = [
  "Unreal Engine 5",
  "Unity",
  "C++",
  "Blueprints",
  "C#",
  "Blender",
  "ZBrush",
  "Substance 3D Painter",
  "MetaHuman",
  "Motion Capture",
];

export default function Home() {
  return (
    <>
      <CatCursor />
      <AboutDecorations />
      <div className="top-navigation-track">
        <Header githubUrl={links.github} />
      </div>

      <main>
        <section className="hero" id="top">
          <span className="home-edge-fade" aria-hidden="true" />
          <span className="home-crt-noise" aria-hidden="true" />
          <DelayedPrismScan />
          <div className="hero-device-stage" aria-label="Portfolio preview inside a retro computer monitor">
            <div className="monitor-device-zoom">
              <Image
                className="monitor-shell"
                src="/frames/beige-monitor.png"
                alt="Digitally recolored retro computer displaying Eunchae Won's portfolio"
                width={640}
                height={640}
                priority
                sizes="(max-width: 900px) 88vw, 92vw"
              />
              <div className="monitor-screen monitor-portfolio">
                <MonitorStatic />
                <div className="monitor-perspective-content">
                  <p
                    className="monitor-kicker monitor-kicker-glitch"
                    aria-label="Real-Time Digital Artist · Creative Developer"
                  >
                    <span aria-hidden="true">Real-Time Digital Artist ·</span>
                    <span aria-hidden="true">Creative Developer</span>
                  </p>
                  <MonitorGlitchTitle />
                  <p className="monitor-intro">
                    I am building strange worlds for strange beings.
                  </p>
                  <div className="monitor-actions">
                    <span className="monitor-button monitor-button-primary">
                      <span className="monitor-button-label">View&nbsp;World&nbsp;↗</span>
                    </span>
                  </div>
                  <span className="monitor-glare" aria-hidden="true" />
                </div>
                <a className="monitor-world-link" href="/world" aria-label="Enter Cat Paw World" />
              </div>
              <span className="monitor-click-cursor" aria-hidden="true">
                <span>↖</span>
                <small>Click</small>
              </span>
            </div>
            <div className="cat-status">
              <span className="cat-bob" aria-hidden="true">🐈‍⬛</span>
              <span>status: making tiny worlds</span>
            </div>
          </div>

          <span className="sprinkle sprinkle-a" aria-hidden="true" />
          <span className="sprinkle sprinkle-b" aria-hidden="true" />
          <span className="sprinkle sprinkle-c" aria-hidden="true" />
          <span className="sprinkle sprinkle-d" aria-hidden="true" />
        </section>

        <div className="hero-play-buffer" aria-hidden="true">
          <span className="home-edge-fade" />
          <span className="home-crt-noise" />
        </div>

        <Reveal>
          <section className="play-section" id="play">
            <span className="home-edge-fade" aria-hidden="true" />
            <span className="home-crt-noise" aria-hidden="true" />
            <span className="cassette-flicker-underlay" aria-hidden="true" />
            <div className="cassette-index-heading">
              <p className="eyebrow">Portfolio archive / Tape library</p>
              <div className="cassette-player-original">
                <span className="cassette-neon-shard cassette-neon-shard-a" aria-hidden="true" />
                <span className="cassette-neon-shard cassette-neon-shard-b" aria-hidden="true" />
                <Image
                  className="cassette-device-image"
                  src="/frames/cassette-device-v6.png"
                  alt="Original silver cassette recorder"
                  width={964}
                  height={600}
                  sizes="(max-width: 680px) 92vw, 520px"
                />
                <span className="cassette-neon-shard cassette-neon-shard-c" aria-hidden="true" />
              </div>
            </div>
            <CassetteLibrary projects={projects} />
          </section>
        </Reveal>

        <div className="play-about-buffer" aria-hidden="true">
          <span className="home-edge-fade" />
          <span className="home-crt-noise" />
        </div>

        <section className="about-section" id="about">
          <Reveal className="about-heading">
            <p className="eyebrow">About / Player 01</p>
            <h2>About<br />Eunchae Won</h2>
            <div className="about-contact-side-title">
              <p className="eyebrow">Contact / Continue?</p>
              <h3>Contact</h3>
            </div>
          </Reveal>
          <Reveal className="about-copy">
            <p className="about-lead">
              I&apos;m Eunchae Won, a solo game developer and digital artist making
              playable works about choice, transformation, memory, and the body.
            </p>
            <p>
              Since 2021, I have developed 2D and 3D PC games, real-time moving
              image, performance-based animation, and physical controllers. I work
              across the whole pipeline—from gameplay programming and systems design
              to modeling, texturing, rigging, animation, sound, and presentation.
            </p>

            <section className="education-block" aria-labelledby="education-title">
              <div className="education-heading">
                <p className="eyebrow" id="education-title">Education / Degrees</p>
                <span aria-hidden="true">02 records</span>
              </div>
              <div className="education-list">
                <article>
                  <span className="education-index">01</span>
                  <div>
                    <h3>Diploma in Media Art</h3>
                    <p>Staatliche Hochschule für Gestaltung Karlsruhe (HfG Karlsruhe)</p>
                    <small>Karlsruhe, Germany · Sep 2021–Sep 2025 · Final grade 1.7 (Very good)</small>
                  </div>
                </article>
                <article>
                  <span className="education-index">02</span>
                  <div>
                    <h3>Bachelor of Fine Art</h3>
                    <p>Kookmin University</p>
                    <small>Seoul, South Korea · Mar 2014–Feb 2019</small>
                  </div>
                </article>
              </div>
            </section>

            <section className="about-contact-card" id="contact" aria-labelledby="about-contact-title">
              <div className="about-contact-heading">
                <p className="eyebrow">Contact / Continue?</p>
                <h3 id="about-contact-title">Get in touch</h3>
              </div>
              <div className="about-contact-links">
                <a href={links.email}>
                  <span>Email</span><strong>artiwon821@gmail.com</strong><i aria-hidden="true">↗</i>
                </a>
                <a href={links.github} target="_blank" rel="noreferrer">
                  <span>GitHub</span><strong>@EunchaeWon</strong><i aria-hidden="true">↗</i>
                </a>
                <a href={links.itch} target="_blank" rel="noreferrer">
                  <span>itch.io</span><strong>eunchaewon.itch.io</strong><i aria-hidden="true">↗</i>
                </a>
              </div>
            </section>
          </Reveal>

          <Reveal className="skills-block">
            <div className="skills-radio-frame">
              <Image
                src="/frames/silver-radio.png"
                alt="Silver radio cassette recorder framing the technology list"
                width={620}
                height={620}
                sizes="(max-width: 900px) 280px, 19vw"
              />
              <div className="radio-portfolio-display" aria-hidden="true">
                <span>TOOLS</span>
                <strong>UE5 · UNITY · C++</strong>
              </div>
            </div>
            <p className="eyebrow">Main technologies</p>
            <ul className="skills-list">
              {skills.map((skill, index) => (
                <li key={skill}>
                  <span>{String(index + 1).padStart(2, "0")}</span>{skill}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

      </main>


      <footer>
        <span>© 2026 Eunchae Won</span>
        <span>Designed for play · Built with Next.js</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
