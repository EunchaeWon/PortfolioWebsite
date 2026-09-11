export type ProjectAccent = "acid" | "violet" | "coral" | "sky";

export type ProjectGalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

export type ProjectRecognition = {
  title: string;
  organization: string;
  date: string;
  image: string;
  imageAlt: string;
  sourceUrl?: string;
  sourceLabel?: string;
};

export type ProjectBreakdown = {
  challenge: string;
  whatIBuilt: string;
  technicalImplementation: string;
  result: string;
};

export type ProjectVideo = {
  label: string;
  url: string;
};

export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  overview: string[];
  thumbnail: string;
  thumbnailAlt: string;
  gameplayMedia: string;
  gameplayAlt: string;
  developmentPeriod: string;
  engine: string;
  technologies: string[];
  role: string;
  keyFeatures: string[];
  breakdown: ProjectBreakdown;
  gallery: ProjectGalleryItem[];
  recognition?: ProjectRecognition;
  githubUrl?: string;
  steamUrl?: string;
  itchUrl?: string;
  videoUrl?: string;
  videos?: ProjectVideo[];
  artworkUrl?: string;
  playableUrl?: string;
  accent: ProjectAccent;
};

const projectCatalog: Project[] = [
  {
    slug: "nowhere-now-here",
    title: "Nowhere, Now Here",
    shortDescription:
      "An atmospheric cat game about small needs, quiet rooms, and the uncanny feeling that someone is about to arrive.",
    overview: [
      "Built in Unreal Engine 5, the work turns a cat's ordinary needs—waking, eating, exploring, and searching for an exit—into a sequence of small narrative interactions. The domestic setting gradually shifts from familiar to uncanny as the player follows those needs.",
      "The project is developed through an end-to-end original 3D pipeline: ZBrush sculpting and optimization, Substance 3D Painter textures, MetaHuman costume fitting, modular room assets, and gameplay logic authored in C++ and Blueprints.",
    ],
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
    breakdown: {
      challenge: "Turn a cat's ordinary needs into a readable gameplay loop while letting a familiar home gradually become uncanny.",
      whatIBuilt: "A cat-led exploration game with original characters, costumes, modular rooms, environmental interactions, and a developing narrative progression.",
      technicalImplementation: "Unreal Engine 5 gameplay systems in C++ and Blueprints, supported by Blender and ZBrush modeling, Substance 3D Painter textures, MetaHuman costume fitting, and performance-aware asset preparation.",
      result: "An evolving playable prototype that demonstrates an end-to-end real-time production pipeline and a distinct atmospheric world.",
    },
    gallery: [
      {
        src: "/projects/gallery/nowhere-cat-candle.webp",
        alt: "A cat character standing beside a lit candle in a dark room",
        caption: "Gameplay study: cat, candle, and domestic scale",
      },
      {
        src: "/projects/gallery/nowhere-cat-model.webp",
        alt: "Textured and untextured cat character models shown in a 3D workspace",
        caption: "Character sculpting and texture development",
      },
      {
        src: "/projects/gallery/nowhere-room.webp",
        alt: "A softly lit living room environment created for the game",
        caption: "Modular interior environment asset",
      },
      {
        src: "/projects/gallery/faces-creature.webp",
        alt: "A dark multi-limbed creature model with a hollow rounded head",
        caption: "Spider Monster character study for the expanded game world",
      },
    ],
    accent: "acid",
  },
  {
    slug: "swan-in-lake",
    title: "Swan in Lake",
    shortDescription:
      "A chain-of-choices game where Odette gathers memories and decides whether to leave the lake.",
    overview: [
      "In a quiet forest, memories, dreams, and values become links in a visible chain. The completed chain leads Odette toward one of two endings—leaving for an uncertain future or remaining with those bound to the lake.",
    ],
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
      "Memories form a visible narrative chain",
      "Two endings shaped by the collected links",
      "Original character and feather-costume pipeline",
    ],
    breakdown: {
      challenge: "Turn a personal decision about leaving home into a playable chain of memories—not a dialogue menu.",
      whatIBuilt: "A forest journey where found memories and values form a visible chain leading to two endings.",
      technicalImplementation: "Original character, feather costume, animation, and branching progression built for a 3D PC game.",
      result: "A playable autobiographical work about migration, memory, and the choice to leave.",
    },
    gallery: [
      {
        src: "/projects/gallery/swan-cover-zine.png",
        alt: "Odette beside layered black swan silhouettes in a blue illustrated landscape",
        caption: "Early cover collage and visual direction",
      },
      {
        src: "/projects/gallery/swan-lake.webp",
        alt: "A swan crossing a still lake beneath narrative text",
        caption: "Ending I — Odette remains beside the lake",
      },
      {
        src: "/projects/gallery/swan-leave-ending.jpg",
        alt: "The alternate ending where Odette leaves the lake to pursue her dream",
        caption: "Ending II — Odette leaves to follow her dream",
      },
      {
        src: "/projects/gallery/swan-journey.webp",
        alt: "Odette in a feathered white dress beside a blue lake",
        caption: "Odette's journey through the choice landscape",
      },
      {
        src: "/projects/gallery/swan-costume.webp",
        alt: "Full-body 3D model of Odette wearing a layered feather costume",
        caption: "Feather costume modeling and character development",
      },
      {
        src: "/projects/gallery/swan-nymph.jpg",
        alt: "Grayscale sculpt of Odette wearing a crown and feather costume",
        caption: "Odette sculpt and feather silhouette study",
      },
    ],
    itchUrl: "https://eunchaewon.itch.io/swan-in-lake",
    videoUrl: "https://youtu.be/VLePcd6hA2o",
    accent: "violet",
  },
  {
    slug: "faces-within-the-wheel",
    title: "Faces within the Wheel",
    shortDescription:
      "Winner — Best Animation at the Kraken International Film Festival, Autumn 2025. A looping gameplay-derived work of unstable bodies and morphing identities.",
    overview: [
      "The work begins as a game space but is presented as a single-channel looping video assembled from recorded gameplay. Rather than moving toward a conventional win state, it follows bodies that split, multiply, and morph through unstable environments.",
      "Eunchae Won produced the game, creature modeling, rigging, animation, sound, gameplay recording, and final video. The work won Best Animation at the Kraken International Film Festival, Autumn 2025.",
    ],
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
      "Winner — Best Animation, Kraken International Film Festival 2025",
    ],
    breakdown: {
      challenge: "Build a coherent moving-image work from a game space designed around unstable bodies, transformation, and repetition rather than a conventional win state.",
      whatIBuilt: "The complete real-time work: game space, creatures, body-morph sequences, rigging, animation, sound, gameplay recording, and final looping video.",
      technicalImplementation: "Original 3D creature modeling and rigging, animated transformations, real-time scene production, gameplay capture, sound construction, and single-channel video editing.",
      result: "Winner — Best Animation, Kraken International Film Festival, Autumn 2025, with the official festival listing naming Eunchae Won as director.",
    },
    gallery: [
      {
        src: "/projects/gallery/faces-gameplay.webp",
        alt: "A blue multi-armed figure surrounded by angular branching forms",
        caption: "Recorded gameplay frame from the looping video",
      },
      {
        src: "/projects/gallery/faces-red-creature.png",
        alt: "Close view of a red multi-limbed creature model against a black background",
        caption: "Red creature modeling and anatomy study",
      },
      {
        src: "/projects/gallery/faces-flower-creature.png",
        alt: "A layered winged figure surrounded by pale organic forms and angular fragments",
        caption: "Layered figure and winged-form composition",
      },
      {
        src: "/projects/gallery/faces-morph.webp",
        alt: "Layered figures emerging from a large flower-like structure",
        caption: "Multiplying bodies inside the game space",
      },
    ],
    recognition: {
      title: "Winner — Best Animation",
      organization: "Kraken International Film Festival",
      date: "Autumn 2025",
      image: "/projects/gallery/faces-kraken-selection.webp",
      imageAlt: "Official Selection laurel for Kraken International Film Festival, Autumn 2025",
      sourceUrl: "https://www.krakenfilmfest.com/autumn-2025-winners",
      sourceLabel: "Official proof · Faces within the Wheel — Best Animation",
    },
    artworkUrl: "https://eunchae.artstation.com/projects/ZlYrRR",
    videoUrl: "https://youtu.be/vZ_Cf_vFcvo",
    accent: "coral",
  },
  {
    slug: "in-the-forest",
    title: "In the Forest",
    shortDescription:
      "A dual-channel performance film and animation where five live roles are reinterpreted through uncanny digital creatures.",
    overview: [
      "Two synchronized videos connect a live performance in a forest with a digital animation. A narrator guides five performers as they spontaneously move through the roles of Forest, Seed, Forest Keeper, Visitor, and Wild Animal.",
      "After filming, corresponding 3D creatures were modeled and the performers' motion was captured and retargeted to them. The score changes through the interpretations of writer, director, narrator, performers, digital characters, and audience, treating embodiment as something alive and continually evolving.",
    ],
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
    breakdown: {
      challenge: "Preserve the relationship between an improvised forest performance and its digital reinterpretation across two synchronized video channels.",
      whatIBuilt: "A live-action performance channel and a corresponding animation channel populated by five original digital creatures representing the work's five roles.",
      technicalImplementation: "Recorded performer movement was captured, retargeted to 3D characters in Blender, refined through character animation, and synchronized with the live-performance edit.",
      result: "A dual-channel work in which physical gesture and digital embodiment remain visible together rather than one replacing the other.",
    },
    gallery: [
      {
        src: "/projects/gallery/forest-landscape.webp",
        alt: "A creature crossing a distant ridge in a forest landscape",
        caption: "Digital creature moving through the landscape",
      },
      {
        src: "/projects/gallery/forest-performance.webp",
        alt: "Five performers moving together in a forest clearing",
        caption: "Live performance source for motion capture",
      },
      {
        src: "/projects/gallery/forest-character.webp",
        alt: "Black and white creature model with a rounded mask-like head",
        caption: "One of the five digitally reinterpreted roles",
      },
    ],
    videos: [
      {
        label: "Watch · Animation",
        url: "https://youtu.be/8EsmQielYXA",
      },
      {
        label: "Watch · Live performance",
        url: "https://youtu.be/0GkLYedyLgo",
      },
    ],
    accent: "sky",
  },
  {
    slug: "cycle",
    title: "Cycle",
    shortDescription:
      "A 3D game about escape and return—entering another world to outrun routine, only to find repetition waiting there too.",
    overview: [
      "Cycle reflects on escape and return: the player enters a game to flee powerless routines, only to encounter repetition once more. Its characters operate as fragments of the self and mirrors of society, turning the journey into a meditation on hardship and transformation.",
      "Built in Unity with real-world map data, the game shifts familiar geography into a surreal space. By stepping into another character's gaze, the player is invited to test whether a change in perspective can create a path toward freedom.",
    ],
    thumbnail: "/projects/cycle-thumb.webp",
    thumbnailAlt: "A lone player character crossing a dark surreal landscape",
    gameplayMedia: "/projects/gallery/cycle-gameplay.webp",
    gameplayAlt: "A player character riding through a dark surreal landscape toward a red-lit opening",
    developmentPeriod: "2023 · Exhibited 2024",
    engine: "Unity",
    technologies: ["Unity", "C#", "3D", "Real-world Map Data", "Animation", "Sound"],
    role: "Solo producer & developer",
    keyFeatures: [
      "Unity-based 3D PC game built with real-world map data",
      "Characters act as fragments of self and mirrors of society",
      "Exhibited in the UNESCO City of Media Arts, Karlsruhe",
    ],
    breakdown: {
      challenge: "Make the cycle of escape and repetition tangible through navigation, character perspective, and a transformed version of familiar geography.",
      whatIBuilt: "A surreal 3D PC game whose environments and characters turn routine, hardship, and changes of perspective into an explorable journey.",
      technicalImplementation: "Unity and C# production using real-world map data, custom 3D environments, character behavior, animation, sound, and scene progression.",
      result: "A completed game exhibited in Karlsruhe, a UNESCO City of Media Arts, in 2024.",
    },
    gallery: [],
    videoUrl: "https://www.youtube.com/watch?v=BUYdKkmxUrY",
    accent: "violet",
  },
  {
    slug: "hopeless-butterfly",
    title: "Hopeless Butterfly",
    shortDescription:
      "A 2D/3D PC game and physical interface that turns the wish to transform—and the frustration of being unable to—into play.",
    overview: [
      "The Unity-based game moves through four stages of transformation: larva, 2D butterfly, muscle fly, and flower-fly. Clearing a stage promises escape from boredom and melancholy, yet each transformation leads to another form of helplessness rather than a final release.",
      "A handmade cocoon controller carries that emotional condition into the player's body. Its awkward form and limited controls resist familiar ideas of mastery and efficiency, placing the player between the possibility of transformation and the restriction of being unable to move forward.",
    ],
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
    breakdown: {
      challenge: "Express the desire to transform—and the frustration of being unable to—through both on-screen play and the player's physical actions.",
      whatIBuilt: "A four-stage 2D/3D transformation game and a handmade cocoon controller whose awkward form makes restriction part of the experience.",
      technicalImplementation: "Unity and C# gameplay across four visual forms, combined with physical-computing input, custom controller fabrication, animation, and sound.",
      result: "An interactive game and physical interface exhibited at Kinemathek Karlsruhe in 2022.",
    },
    gallery: [
      {
        src: "/projects/gallery/butterfly-stage.webp",
        alt: "Side-scrolling 2D butterfly stage with flowers and platforms",
        caption: "Stage 2: the 2D butterfly game",
      },
      {
        src: "/projects/gallery/butterfly-muscle-fly.webp",
        alt: "Two dark muscular fly creatures facing one another",
        caption: "Stage 3: muscle-fly transformation",
      },
      {
        src: "/projects/gallery/butterfly-controller.webp",
        alt: "A handmade cocoon-shaped game controller held in two hands",
        caption: "The cocoon controller as a physical interface",
      },
      {
        src: "/projects/gallery/butterfly-controller-build.webp",
        alt: "Open cocoon controller showing wiring and electronic components",
        caption: "Controller electronics and fabrication process",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=csbaT66bSg4&t=6s",
    accent: "acid",
  },
];

export const projects = [...projectCatalog].sort((first, second) => {
  if (first.slug === "faces-within-the-wheel") return -1;
  if (second.slug === "faces-within-the-wheel") return 1;
  return 0;
});
