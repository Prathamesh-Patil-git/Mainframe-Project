# Mainframe Control Tower — Internal Application (Phase 2)

Build the signed-in operations app behind the existing Sign In / Sign Up. Landing page, auth pages and brand stay untouched. Everything runs on clearly labelled demo data — no backend in this phase.

## What gets built

**App shell (shared by every internal page)**
- Collapsible left sidebar: brand, grouped navigation (Overview / Operations / Insights / Administration), line icons, "Mainframe Connection — Connected · Last sync 22:08:31 · Demo data" card at the bottom. Drawer on tablet/mobile.
- Top header: global search (jobs, streams, error types, datasets — instant dropdown results), notification bell with 3 operational events, environment badge, user menu (Operator · HERC02 → Profile, Settings, Audit Log, Sign Out).

**Pages**
1. Dashboard — 8 KPI clay cards with sparklines, live workload streams (ING/TRN/BIL/REP jobs with animated status dots), batch stream health, workload activity chart, AI operations panel, critical failures, dependency impact preview, execution timeline, recent activity, refresh button.
2. Jobs — filterable/sortable table; Job detail page with summary, step execution table, JCL/SYSOUT log viewer, dependencies, AI insight.
3. Batch Streams — stream cards plus stream detail view.
4. Dependencies — interactive graph showing TRN003 failure and its blocked downstream jobs.
5. Failures — failure list with severity, return/abend codes, affected jobs.
6. AI Analysis — root-cause panel, evidence, confidence, recommended actions (labelled illustrative).
7. Recovery — recovery plans, step-by-step actions, approval states (simulated).
8. Reports — summary metrics and charts with export buttons (disabled / demo).
9. Datasets — VSAM/sequential dataset table (e.g. NP.BATCH.JOBMASTER).
10. Settings, Admin Users, Audit Log.

**Design system**
- Keeps existing fonts and navy palette; adds a restrained claymorphism surface (large radius, soft outer + subtle inner shadow) used only for KPI, status, AI, alert and summary cards. Tables, logs, graphs, timelines and code stay flat.
- Status colours: blue running, green completed, amber warning, red failed, orange blocked, gray waiting, soft violet AI.
- Role-based UI: Operator vs Administrator (admin pages hidden for operators), chosen from the Sign Up role and remembered in the browser for the demo.
- Loading skeletons, empty and error states, keyboard focus, reduced-motion respect.
- Simulated live updates (a job occasionally flips RUNNING → COMPLETED) behind a single "live feed" module so real-time updates can replace it later.

## Technical details
- Pathless layout `src/routes/_app.tsx` (renders sidebar + header + `<Outlet />`) with child route files: `_app.dashboard.tsx` (replaces current placeholder), `_app.jobs.index.tsx`, `_app.jobs.$jobId.tsx`, `_app.streams.tsx`, `_app.dependencies.tsx`, `_app.failures.tsx`, `_app.ai-analysis.tsx`, `_app.recovery.tsx`, `_app.reports.tsx`, `_app.datasets.tsx`, `_app.settings.tsx`, `_app.admin.users.tsx`, `_app.admin.audit-log.tsx`. Each with its own noindex head().
- Demo data in `src/lib/demo/*.ts` (jobs, streams, failures, dependencies, datasets, users, audit) accessed through a `src/lib/api/` service layer returning promises, so FastAPI calls can be swapped in later; reads via TanStack Query.
- Sign In / Sign Up keep their look; on success they store a demo session (name, role) in localStorage and the layout redirects to /signin when absent. Clearly a demo gate, not real security.
- Charts with recharts; dependency graph as custom SVG (no heavy graph lib). Clay utilities via `@utility clay` in styles.css.
- Record the structure (layout, demo service layer) in AGENTS.md.
