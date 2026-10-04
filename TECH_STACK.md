# Frontend Tech Stack — Mainframe Control Tower

## Core

| Layer | Technology |
| --- | --- |
| Framework | TanStack Start v1 — full-stack React 19 with SSR and server functions |
| Router | TanStack Router (file-based routing in `src/routes/`) |
| Data fetching | TanStack Query (`useSuspenseQuery` + route loaders / `ensureQueryData`) |
| Language | TypeScript (strict) |
| Build tool | Vite 7 (targets Edge/Worker runtime for server functions) |
| Styling | Tailwind CSS v4 — CSS-first config via `src/styles.css` (`@theme`, oklch design tokens) |
| Components | shadcn-style components on Radix UI primitives |
| Icons | lucide-react |
| Forms | Plain `useState` + zod validation (no form library) |
| Charts | recharts (activity/trend charts) |
| Custom visuals | Hand-built SVG (workload flow on the public site, dependency graph in the console) |

## Typography

| Role | Family |
| --- | --- |
| Display (public site headlines) | Instrument Serif |
| Console headings | Libre Baskerville |
| Body / UI | Geist (public site), IBM Plex Sans (internal console) |
| Mono (job names, RCs, labels, code) | IBM Plex Mono |

## Project structure conventions

- Public pages (landing, sign in, sign up) live at the top level of `src/routes/`; the signed-in console lives under the pathless `_app` layout (sidebar + header shell).
- Demo data lives in `src/lib/demo/`, exposed through `src/lib/api/` query options so it can be swapped for a real backend later.
- Live updates flow only through `src/lib/live.ts` (single seam for a future WebSocket feed).
- The internal console's colors and typography are scoped under the `.internal-app` class so its visual system stays independent of the public site's editorial theme.
- Claymorphism (`clay` utility) is reserved for summary/KPI/AI/status cards; tables, logs, graphs and technical detail stay flat (`flat-panel`).
