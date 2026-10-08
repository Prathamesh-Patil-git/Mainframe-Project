<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules

- Internal app pages live under the pathless `_app` layout route (sidebar + header); public pages stay top-level — keeps marketing and operations shells separate.
- Internal data is read through `src/lib/api` query options backed by `src/lib/demo`; swap the api functions for real backend calls later without touching pages.
- Live updates come only from `src/lib/live.ts` — single seam to replace with a WebSocket feed.
- Sign-in is a browser-stored demo session (`src/lib/session.ts`), not real security; replace with real auth before production.
- Claymorphism (`clay` utility) is for summary/KPI/AI/status cards only; tables, logs, graphs use `flat-panel` — preserves readability.
- Public and internal pages share global semantic palette and sans-serif typography tokens; internal layout treatments remain scoped under `.internal-app` — keeps the reference style consistent without coupling page structure.
