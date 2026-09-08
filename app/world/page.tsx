import Link from "next/link";
import { CatCursor } from "@/components/CatCursor";
import { MouseCatSprinkles } from "@/components/MouseCatSprinkles";
import { WorldViewer } from "@/components/WorldViewer";

export default function WorldPage() {
  return (
    <>
      <CatCursor />
      <MouseCatSprinkles />
      <main className="world-page">
        <header className="world-header">
          <Link className="world-back" href="/">
            ← Back to portfolio
          </Link>
          <p>CAT PAW WORLD / 01</p>
        </header>

        <section className="world-intro">
          <div>
            <p className="eyebrow">Interactive 3D scene</p>
            <h1>Eunchae Won</h1>
          </div>
          <p>Drag to orbit · Scroll or pinch to zoom</p>
        </section>

        <WorldViewer />
      </main>
    </>
  );
}
