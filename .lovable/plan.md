# Mainframe Control Tower — Phase 1 Public Website

Build only the landing page, Sign In, Sign Up, and a placeholder Dashboard. No internal app screens.

## Visual direction
- Warm off-white background, near-black type, dark navy accents, muted blue, subtle green (success), amber (warning), red only for failure.
- Editorial typography: a refined serif display (e.g. Instrument Serif / Newsreader) for headlines, a clean grotesk (e.g. Geist / IBM Plex Sans) for body, mono (IBM Plex Mono) for job names, return codes, labels.
- Generous whitespace, thin borders, soft shadows, moderately rounded containers. No neon, glass, heavy gradients, logo walls or card grids.
- Subtle scroll-reveal fades, animated dashed dependency lines, gentle hover states. Respects reduced-motion.

## Pages
- `/` Landing page, in this order:
  1. Sticky nav (logo, Product, How It Works, AI, About, Sign In, Get Started) with background on scroll + mobile menu.
  2. Hero: eyebrow, headline, copy, two CTAs, animated workload flow diagram (Ingestion → Transaction → Processing → Billing/Risk → Reporting) with completed/running/warning/failed states.
  3. Restrained tech line: JCL · COBOL · VSAM · JES · SORT · AI · APIs.
  4. Problem section with failure-cascade illustration.
  5. Product preview mockup (job counts, 8 streams, statuses, mini dependency graph, recent failures, timeline).
  6. Four alternating feature sections: See every workload / Follow every dependency / Understand every failure / Recover with confidence — each with a custom visual.
  7. AI section: TRN003 illustrative analysis revealing failure → cause → impact → recommendation, labeled "Illustrative example".
  8. "From batch execution to intelligent recovery" horizontal process.
  9. Metrics (45+, 8, 100+, 10K+, 500+, 50K+) clearly marked as demo-environment values.
  10. Benefits (four typographic items) with inline tech foundation line.
  11. "Designed with enterprise operations in mind" credibility list (no fake customers/testimonials).
  12. Final CTA with abstract dependency visual.
  13. Footer with links, tech list, "© 2026 · Academic / Project Demonstration".
  - Nav items Product / How It Works / AI / About scroll to in-page sections (smooth scrolling), as the spec describes a single landing page.
- `/signin`: split layout — branding + workload visual left; form right (email/username, password with show/hide, remember me, forgot password, validation, loading state, link to sign up).
- `/signup`: matching layout — full name, email, username, password, confirm password, role (Operator/Administrator), terms checkbox, validation, loading, link to sign in.
- `/dashboard`: simple placeholder "Dashboard experience coming in the next phase."

## Behavior
- Forms validate client-side (zod) and, after a short simulated loading state, redirect to `/dashboard`. No real accounts yet — real authentication can be added in a later phase.
- Keyboard accessible, visible focus rings, responsive typography.

## Technical details
- Design tokens (incl. success/warning/navy) in `src/styles.css`; fonts via `<link>` in `__root.tsx`.
- Routes: `index.tsx`, `signin.tsx`, `signup.tsx`, `dashboard.tsx`, each with unique head() metadata; replace root "Lovable App" metadata.
- Components in `src/components/landing/*` (Nav, Hero, WorkloadFlow SVG, sections, Footer) and `src/components/auth/AuthLayout`.
- Reveal animations via a small IntersectionObserver hook + CSS transitions; SVG diagrams hand-built (no stock images).
- react-hook-form + zod for forms; shadcn-style inputs.
