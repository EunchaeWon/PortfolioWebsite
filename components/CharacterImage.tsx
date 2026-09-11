import Image from "next/image";
import type { ComponentProps } from "react";

export function CharacterImage(props: ComponentProps<typeof Image>) {
  const src = typeof props.src === "string" ? props.src : "";
  if (!src.startsWith("/characters/") || !src.endsWith(".png")) return <Image {...props} />;
  return <picture style={{ display: "contents" }}>
    <source media="(max-width: 680px)" srcSet={src.replace("/characters/", "/characters/mobile/").replace(/\.png$/, ".webp")} type="image/webp" />
    <Image {...props} priority={false} />
  </picture>;
}
