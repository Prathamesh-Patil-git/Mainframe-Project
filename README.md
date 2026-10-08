# Mainframe Control Tower

A control-tower web application for monitoring and managing mainframe batch workloads — public marketing site plus an internal operations console (dashboard, jobs, batch streams, dependency map, failures, AI analysis, recovery, reports, datasets, settings, users, audit log).

> Academic / Project Demonstration · demo data only

## Frontend

The frontend stack is documented in [TECH_STACK.md](./TECH_STACK.md).

## Development

```sh
git clone <this-repository-url>
cd mainframe-control-tower
npm i
npm run dev
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development-mode build (prerender) |
| `npm run preview` | Preview the production build |
| `npm run test` | Run tests (Vitest) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Deployment

The app builds with Nitro, which supports multiple hosts from one codebase:

- **Vercel** — import the repository (framework preset: **Other**). `vercel.json` supplies the build command (`vite build`) and output directory; the Vercel preset is selected automatically (`VERCEL=1`). No extra dependencies or environment variables needed.
- **Cloudflare** — the default build target (`cloudflare-module` preset), used by the Lovable preview.

See [TECH_STACK.md](./TECH_STACK.md#deployment) for details.

## Built with

- TanStack Start (React 19)
- TypeScript
- Tailwind CSS v4
- Vite
