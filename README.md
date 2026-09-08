# Eunchae Won — Game Developer Portfolio

A responsive, project-first portfolio for indie solo game developer and digital artist Eunchae Won. The site uses content and imagery adapted from the 2026 artist portfolio, with a retro editorial interface, restrained glitch effects, a cat cursor, and accessible motion fallbacks.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- No backend or database

## Run locally

Requirements: Node.js 20.9 or newer and pnpm. The Node requirement follows the current [Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation).

```bash
cd portfolio
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Production checks:

```bash
pnpm lint
pnpm build
pnpm start
```

## Edit projects

All project content lives in [`data/projects.ts`](./data/projects.ts). Add, remove, or reorder objects in the exported `projects` array; the page renders its cards automatically.

Each project supports:

- title, short description, thumbnail, and gameplay image/GIF
- development period, engine, technologies, role, and key features
- GitHub, Steam, itch.io, video, artwork, and playable-build URLs
- one of the built-in accent colors: `acid`, `violet`, `coral`, or `sky`

Put media files in `public/projects/`. The current stills are 1600 × 1000 WebP images. Matching that 16:10 ratio avoids cropping; GIF, WebP, PNG, and JPG URLs also work with the existing card component.

## Connect a playable build

Set `playableUrl` on one project in `data/projects.ts`. The Web Play section will automatically replace its placeholder state with an embedded 16:10 player, and the matching project card will gain a **Play now** link.

For a Unity WebGL export, place the hosted build under `public/play/<project-slug>/` or use an external HTTPS URL. For the Unreal Engine project, use an HTTPS player URL from an Unreal Pixel Streaming deployment. Pixel Streaming runs the packaged Unreal application on a GPU host and sends interactive video and input through the browser; see Epic's [Pixel Streaming overview](https://dev.epicgames.com/documentation/unreal-engine/overview-of-pixel-streaming-in-unreal-engine?lang=en-US).

The external player must permit iframe embedding. If its host blocks framing, keep `playableUrl` unset and link to the player with another project URL instead.

## Deploy to Vercel

### Dashboard

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Set **Root Directory** to `portfolio` because the site lives beside the Unreal project. Vercel documents this setup in its [monorepo guide](https://vercel.com/docs/monorepos).
4. Confirm the detected framework is **Next.js**.
5. Select **Deploy**.

After Vercel assigns the production domain, add `NEXT_PUBLIC_SITE_URL` in **Project Settings → Environment Variables** (for example, `https://your-domain.com`). This gives the Open Graph and Twitter images an absolute production URL. Redeploy once after saving it.

### CLI

From the website directory:

```bash
cd portfolio
pnpm dlx vercel
```

Follow the prompts to link or create the Vercel project. Later production deployments can use `pnpm dlx vercel --prod`. Vercel's current [Next.js deployment guide](https://vercel.com/docs/frameworks/full-stack/nextjs) requires no custom build configuration for a standard Next.js app.

## Project structure

```text
portfolio/
├─ app/                 # Page, metadata, icon, and global visual system
├─ components/          # Reusable ProjectCard and motion utilities
├─ data/projects.ts     # Single source of truth for project content
├─ public/projects/     # Portfolio stills and gameplay media
└─ README.md
```

## Accessibility and motion

- Semantic landmarks and headings are used throughout.
- Keyboard focus states remain visible.
- The custom cat cursor is enabled only for precise pointing devices.
- Touch devices keep their native pointer behavior.
- `prefers-reduced-motion` disables decorative motion and reveal transitions.
