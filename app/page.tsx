import Image from "next/image";
import { CatCursor } from "@/components/CatCursor";
import { CassetteLibrary } from "@/components/CassetteLibrary";
import { CharacterParade } from "@/components/CharacterParade";
import { FloatingCharacters } from "@/components/FloatingCharacters";
import { Header } from "@/components/Header";
import { MonitorGlitchTitle } from "@/components/MonitorGlitchTitle";
import { MouseCatSprinkles } from "@/components/MouseCatSprinkles";
import { NeonCatSprinkles } from "@/components/NeonCatSprinkles";
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
      <MouseCatSprinkles />
      <NeonCatSprinkles />
      <FloatingCharacters vanishOnClick />
      <div className="top-navigation-track">
        <CharacterParade position="top" />
        <Header githubUrl={links.github} />
      </div>

      <main>
        <section className="hero" id="top">
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
                <div className="monitor-perspective-content">
                  <p className="monitor-kicker monitor-kicker-glitch">
                    Eunchae WonㆍDigital Artist / Solo Developer
                  </p>
                  <MonitorGlitchTitle />
                  <p className="monitor-intro">
                    I am building strange worlds for strange beings.
                  </p>
                  <div className="monitor-actions">
                    <a className="monitor-button monitor-button-primary" href="/world">
                      <span className="monitor-button-label">View&nbsp;World&nbsp;↗</span>
                    </a>
                    <a className="monitor-button" href={links.github} target="_blank" rel="noreferrer">
                      <span className="monitor-button-label">GitHub&nbsp;↗</span>
                    </a>
                  </div>
                  <span className="monitor-glare" aria-hidden="true" />
                </div>
              </div>
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

        <Reveal>
          <section className="play-section" id="play">
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

        <section className="about-section" id="about">
          <Reveal className="about-heading">
            <p className="eyebrow">About / Player 01</p>
            <h2>About<br />Eunchae Won</h2>
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

            <div className="about-stats" aria-label="Practice highlights">
              <div><strong>06</strong><span>Selected works</span></div>
              <div><strong>02</strong><span>Core engines</span></div>
              <div><strong>2021</strong><span>Practice began</span></div>
            </div>
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

        <section className="contact-section" id="contact">
          <div className="contact-cat" aria-hidden="true">
            <span>🐈</span>
            <small>say hello!</small>
          </div>
          <p className="eyebrow">Contact / Continue?</p>
          <h2>Contact</h2>
          <div className="contact-links">
            <a href={links.email}>
              <span>Email</span><strong>artiwon821@gmail.com</strong><i>↗</i>
            </a>
            <a href={links.github} target="_blank" rel="noreferrer">
              <span>GitHub</span><strong>@EunchaeWon</strong><i>↗</i>
            </a>
            <a href={links.itch} target="_blank" rel="noreferrer">
              <span>itch.io</span><strong>eunchaewon.itch.io</strong><i>↗</i>
            </a>
          </div>
        </section>
      </main>

      <CharacterParade position="bottom" />

      <footer>
        <span>© 2026 Eunchae Won</span>
        <span>Designed for play · Built with Next.js</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
