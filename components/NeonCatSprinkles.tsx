const sprinkles = [
  { glyph: "ฅ^•ﻌ•^ฅ", className: "neon-sprinkle-1" },
  { glyph: "🐾", className: "neon-sprinkle-2" },
  { glyph: "✦", className: "neon-sprinkle-3" },
  { glyph: "🐾", className: "neon-sprinkle-4" },
  { glyph: "ฅ^•ﻌ•^ฅ", className: "neon-sprinkle-5" },
  { glyph: "✧", className: "neon-sprinkle-6" },
  { glyph: "🐾", className: "neon-sprinkle-7" },
  { glyph: "ฅ^•ﻌ•^ฅ", className: "neon-sprinkle-8" },
  { glyph: "🐾", className: "neon-sprinkle-9" },
  { glyph: "✦", className: "neon-sprinkle-10" },
  { glyph: "ฅ", className: "neon-sprinkle-11 neon-sprinkle-large" },
  { glyph: "ฅฅ", className: "neon-sprinkle-12 neon-sprinkle-large" },
  { glyph: "ᨐฅ", className: "neon-sprinkle-13 neon-sprinkle-large" },
  { glyph: "₍^. .^₎⟆", className: "neon-sprinkle-14 neon-sprinkle-large" },
] as const;

export function NeonCatSprinkles() {
  return (
    <div className="neon-cat-sprinkles" aria-hidden="true">
      {sprinkles.map((sprinkle) => (
        <span
          className={`neon-cat-sprinkle ${sprinkle.className}`}
          key={sprinkle.className}
        >
          {sprinkle.glyph}
        </span>
      ))}
      <span className="neon-paw-sticker neon-paw-sticker-1">
        <Image src="/characters/cat-paw.png" alt="" width={1709} height={2349} draggable={false} />
      </span>
      <span className="neon-paw-sticker neon-paw-sticker-2">
        <Image src="/characters/cat-paw.png" alt="" width={1709} height={2349} draggable={false} />
      </span>
    </div>
  );
}
import Image from "next/image";
