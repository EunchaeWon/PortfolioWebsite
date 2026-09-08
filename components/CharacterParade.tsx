import Image from "next/image";

type CharacterParadeProps = {
  position: "top" | "bottom";
};

export function CharacterParade({ position }: CharacterParadeProps) {
  if (position === "top") {
    return (
      <div className="character-track character-track-top" aria-hidden="true">
        <span className="character-runner meme-cat-runner">
          <Image
            src="/characters/rainbow-meme-cat-transparent.png"
            alt=""
            width={1583}
            height={993}
            sizes="(max-width: 680px) 104px, 150px"
            draggable={false}
          />
        </span>
        <span className="character-runner robot-runner">
          <Image
            src="/characters/flying-pixel-robot.png"
            alt=""
            width={1536}
            height={1024}
            sizes="(max-width: 680px) 86px, 118px"
            draggable={false}
          />
        </span>
      </div>
    );
  }

  return <div className="character-track character-track-bottom" aria-hidden="true" />;
}
