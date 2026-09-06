# AGENTS.md — Project Guide for tools.kazuyatech.id

## Stack
- **Astro 6.x** with `@astrojs/react` integration (React 19 + JSX)
- **Tailwind CSS 4.x** via `@tailwindcss/vite` plugin (NOT PostCSS)
- **Icons**: Iconify **MDI** (`@iconify-json/mdi`) primary + **carbon** for gaps, rendered via `astro-icon` `<Icon name="mdi:xxx" />` in `.astro` files and the React `<Icon name="..." />` from `src/components/ui/Icon.jsx` inside tool components
- **Package manager**: pnpm (lockfile: `pnpm-lock.yaml`)
- **Node**: >= 22.12.0

## Commands
```sh
pnpm install        # install deps
pnpm dev            # dev server at localhost:4321
pnpm build          # production build → dist/
pnpm preview        # preview production build
```

## Project Structure
```
src/
├── pages/              # Astro routes (file = URL path)
│   ├── index.astro     # Homepage — tools listing
│   └── tools/          # Individual tool pages
├── components/
│   ├── layout/         # Header.astro, Footer.astro
│   ├── ads/            # AdBanner.jsx (reusable Adsterra)
│   └── <tool-name>/    # One folder per tool (React JSX)
├── styles/
│   └── global.css      # Tailwind import + base resets
public/                 # Static assets (favicon, og-image, etc.)
.agents/                # PRD and Design System docs
```

## Adding a New Tool
1. Create `src/components/<tool-name>/index.jsx` — React component with tool logic
2. Create `src/pages/tools/<tool-name>.astro` — Astro page that wraps the component
3. Add card link to homepage grid in `src/pages/index.astro`
4. Use `<ComponentName client:load />` to hydrate React in Astro

## Component Pattern (per tool)
- Each tool is a self-contained React component in its own folder
- Use `useState` for inputs/outputs
- UI follows the design system in `.agents/DESIGN.md`
- Use icons via the shared `<Icon>` — `astro-icon`'s `<Icon name="mdi:xxx" />` for `.astro` pages, `src/components/ui/Icon.jsx` for React components (re-exported from `../ui`)
- Icon names are full Iconify names (`mdi:content-copy`, `carbon:language`). React renderer reads `src/components/ui/icons-data.js` (curated subset, generated from `@iconify-json/*` — regenerate when adding icons; astro-icon `include` list in `astro.config.mjs` must match)
- Use Tailwind utility classes for styling
- Default max-width container: `max-w-[680px] mx-auto`

## Ad Integration (Adsterra)
Ad components are in `src/components/ads/AdBanner.jsx`:
- `<AdBanner adKey={KEY} width={728} height={90} />` — iframe banner
- `<AdNative src={SRC} containerId={ID} />` — native banner
- Keys are hardcoded in the component (see `.agents/DESIGN.md` or existing `daget-hunter/index.jsx`)
- **Popunder**: disable on decode/sensitive tool pages, only safe for homepage or encode pages

## Design System
Full spec in `.agents/DESIGN.md`. Quick reference:
- Primary: Near Black `#0e0f0c`, Accent: Wise Green `#9fe870`
- Buttons: pill radius `9999px`, hover `scale(1.05)`, active `scale(0.95)`
- Cards: radius `30px`, border `1px solid rgba(14,15,12,0.12)`
- Headings: font-weight 900, line-height 0.85 (display), Inter 600 for body
- OpenType `"calt"` on all text

## SEO Requirements (Non-negotiable)
- Lighthouse: SEO 100, Performance > 90, Accessibility > 90, Best Practices > 90
- Every page must have: `<title>`, `<meta description>`, OG tags, Twitter Card, canonical URL
- Use structured data (JSON-LD) where applicable
- Language: `id-ID`, all content in Bahasa Indonesia
- `robots: index, follow` on all pages

## Conventions
- Use `<script type="application/ld+json">` for structured data
- Use `Astro.url.pathname` + site constant for canonical URLs
- React components: functional only, no class components
- No comments in code unless user explicitly asks
- File naming: kebab-case for folders and files
