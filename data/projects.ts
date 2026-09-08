export type ProjectAccent = "acid" | "violet" | "coral" | "sky";

export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  thumbnail: string;
  thumbnailAlt: string;
  gameplayMedia: string;
  gameplayAlt: string;
  developmentPeriod: string;
  engine: string;
  technologies: string[];
  role: string;
  keyFeatures: string[];
  githubUrl?: string;
  steamUrl?: string;
  itchUrl?: string;
  videoUrl?: string;
  artworkUrl?: string;
  playableUrl?: string;
  accent: ProjectAccent;
};

export const projects: Project[] = [
  {
    slug: "nowhere-now-here",
    title: "Nowhere, Now Here",
    shortDescription:
      "An atmospheric cat game about small needs, quiet rooms, and the uncanny feeling that someone is about to arrive.",
    thumbnail: "/projects/nowhere-thumb.webp",
    thumbnailAlt: "A black cat waking on a sofa in a hazy, softly lit room",
    gameplayMedia: "/projects/nowhere-gameplay.webp",
    gameplayAlt: "A black cat standing near a plate in a brick-lined interior",
    developmentPeriod: "Ongoing",
    engine: "Unreal Engine 5",
    technologies: [
      "Unreal Engine 5",
      "C++",
      "Blueprints",
      "MetaHuman",
      "Blender",
      "ZBrush",
      "Substance 3D Painter",
    ],
    role: "Solo developer & 3D artist",
    keyFeatures: [
      "Cat-led environmental interactions and daily-needs loop",
      "Custom C++ and Blueprint gameplay systems",
      "Original character, costume, texture, and environment pipeline",
    ],
    githubUrl: "https://github.com/EunchaeWon/Nowhere-Now-here",
    accent: "acid",
  },
  {
    slug: "swan-in-lake",
    title: "Swan in Lake",
    shortDescription:
      "A chain-of-choices game following Odette as memories and dreams gather into the decision that shapes her fate.",
    thumbnail: "/projects/swan-thumb.webp",
    thumbnailAlt: "Collage of Odette, a swan figure, and a blue illustrated lake",
    gameplayMedia: "/projects/swan-gameplay.webp",
    gameplayAlt: "Close-up of Odette against a surreal blue lake landscape",
    developmentPeriod: "2021—2026",
    engine: "3D PC game",
    technologies: [
      "Narrative Design",
      "Blender",
      "Character Art",
      "Substance 3D Painter",
      "3D Animation",
    ],
    role: "Solo developer & artist",
    keyFeatures: [
      "Choice-related items form a visible narrative chain",
      "Two endings shaped by accumulated memories and values",
      "Autobiographical story spanning South Korea and Germany",
    ],
    itchUrl: "https://eunchaewon.itch.io/swan-in-lake",
    accent: "violet",
  },
  {
    slug: "faces-within-the-wheel",
    title: "Faces within the Wheel",
    shortDescription:
      "A looping video work derived from recorded gameplay, moving through unstable bodies, morphing identities, and game-space performance.",
    thumbnail: "/projects/faces-thumb.webp",
    thumbnailAlt: "A blue multi-armed digital figure surrounded by angular lines",
    gameplayMedia: "/projects/faces-gameplay.webp",
    gameplayAlt: "A silhouetted digital character holding a glowing light outdoors",
    developmentPeriod: "2025",
    engine: "Real-time 3D",
    technologies: ["Game Design", "Blender", "Rigging", "Animation", "Sound", "Video"],
    role: "Solo production",
    keyFeatures: [
      "Single-channel looping work built from gameplay capture",
      "Original character morphing, animation, and sound",
      "Official selection, Kraken International Film Festival 2025",
    ],
    artworkUrl: "https://eunchae.artstation.com/projects/ZlYrRR",
    accent: "coral",
  },
  {
    slug: "in-the-forest",
    title: "In the Forest",
    shortDescription:
      "A dual-channel performance film and animation where five live roles are reinterpreted through uncanny digital creatures.",
    thumbnail: "/projects/forest-thumb.webp",
    thumbnailAlt: "A large pale digital creature crossing a distant forested hill",
    gameplayMedia: "/projects/forest-gameplay.webp",
    gameplayAlt: "Performers moving together in a green forest clearing",
    developmentPeriod: "2024",
    engine: "Blender / Film",
    technologies: ["Blender", "Motion Capture", "Retargeting", "3D Animation", "Performance"],
    role: "3D artist, animator & performer",
    keyFeatures: [
      "Two synchronized video channels",
      "Motion captured from live performance and retargeted to 3D creatures",
      "Five roles interpreted across narrator, performers, and digital bodies",
    ],
    videoUrl: "https://www.youtube.com/watch?v=0GkLYedyLgo",
    accent: "sky",
  },
  {
    slug: "cycle",
    title: "Cycle",
    shortDescription:
      "A 3D game about escape and return—entering another world to outrun routine, only to find repetition waiting there too.",
    thumbnail: "/projects/cycle-thumb.webp",
    thumbnailAlt: "A lone player character crossing a dark surreal landscape",
    gameplayMedia: "/projects/cycle-gameplay.webp",
    gameplayAlt: "A black and white sculptural character with an oval mask",
    developmentPeriod: "2023 · Exhibited 2024",
    engine: "Unity",
    technologies: ["Unity", "C#", "3D", "Real-world Map Data", "Animation", "Sound"],
    role: "Solo producer & developer",
    keyFeatures: [
      "Unity-based 3D PC game built with real-world map data",
      "Characters act as fragments of self and mirrors of society",
      "Exhibited in the UNESCO City of Media Arts, Karlsruhe",
    ],
    githubUrl: "https://github.com/EunchaeWon/Cycle",
    videoUrl: "https://www.youtube.com/watch?v=BUYdKkmxUrY",
    accent: "violet",
  },
  {
    slug: "hopeless-butterfly",
    title: "Hopeless Butterfly",
    shortDescription:
      "A 2D/3D PC game and physical interface that turns the wish to transform—and the frustration of being unable to—into play.",
    thumbnail: "/projects/butterfly-thumb.webp",
    thumbnailAlt: "Four stages of a butterfly transformation game",
    gameplayMedia: "/projects/butterfly-gameplay.webp",
    gameplayAlt: "Development collage for a handmade cocoon-shaped controller",
    developmentPeriod: "2022",
    engine: "Unity",
    technologies: ["Unity", "C#", "2D / 3D", "Physical Computing", "Custom Controller", "Sound"],
    role: "Solo developer & artist",
    keyFeatures: [
      "Four-stage butterfly transformation system",
      "Handmade cocoon controller that embodies restriction and uncertainty",
      "Exhibited at Kinemathek Karlsruhe in 2022",
    ],
    videoUrl: "https://www.youtube.com/watch?v=csbaT66bSg4&t=6s",
    accent: "acid",
  },
];
