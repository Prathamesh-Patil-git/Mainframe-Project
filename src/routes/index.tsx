import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Menu, X, Layers, Network, Sparkles, LifeBuoy } from "lucide-react";
import { Logo, Reveal, Dot, WorkloadFlow, type Status } from "@/components/site";
import { Button } from "@/components/ui/button";
import heroDatacenter from "@/assets/hero-datacenter.jpg";
import controlRoom from "@/assets/control-room.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mainframe Control Tower — AI-Powered Batch Workload Monitoring" },
      { name: "description", content: "Monitor mainframe batch execution, understand failures, trace downstream impact and recover with AI-assisted recommendations." },
      { property: "og:title", content: "Mainframe Control Tower — Clarity for complex mainframe workloads" },
      { property: "og:description", content: "AI-powered visibility and intelligent recovery for enterprise batch workloads." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const btn = "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const btnP = `${btn} bg-primary text-primary-foreground hover:bg-primary/90`;
const btnS = `${btn} border border-border bg-card hover:bg-secondary`;
const btnLight = `${btn} bg-primary-foreground text-navy hover:bg-primary-foreground/90`;
const btnGhost = `${btn} border border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20`;
const eyebrow = "font-mono text-[11px] tracking-[0.22em] text-muted-foreground";
const eyebrowLight = "hero-lead font-mono text-[11px] text-primary-foreground/85";
const h2 = "font-display text-3xl leading-tight sm:text-4xl";
const panel = "rounded-lg border border-border bg-card shadow-soft";

function Landing() {
  return (
    <div className="overflow-x-hidden">
      <Nav />
      <Hero />
      <Problem />
      <Preview />
      <Features />
      <AI />
      <Process />
      <Metrics />
      <Benefits />
      <Enterprise />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [["Product", "#product"], ["How It Works", "#how"], ["AI", "#ai"], ["About", "#about"]];
  const onDark = !scrolled && !open;
  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled || open ? "border-b border-border bg-background/90 backdrop-blur" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo tone={onDark ? "light" : "dark"} />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map(([l, h]) => <a key={h} href={h} className={`text-sm transition ${onDark ? "text-muted-foreground hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{l}</a>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/signin" className={`px-3 py-2 text-sm font-medium transition ${onDark ? "text-primary-foreground/90 hover:text-primary-foreground" : "hover:text-accent"}`}>Sign In</Link>
          <Link to="/signup" className={`${onDark ? btnLight : btnP} py-2`}>Get Started</Link>
        </div>
        <button className={`rounded-md p-2 md:hidden ${onDark ? "text-primary-foreground" : ""}`} onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border px-6 py-4 md:hidden">
          {links.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block py-2.5">{l}</a>)}
          <div className="mt-3 flex gap-2">
            <Link to="/signin" className={`${btnS} flex-1`}>Sign In</Link>
            <Link to="/signup" className={`${btnP} flex-1`}>Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return <section id={id} className={`scroll-mt-16 px-6 py-16 sm:py-20 ${className}`}><div className="mx-auto max-w-7xl">{children}</div></section>;
}

function Hero() {
  return (
    <>
      <Section className="relative pt-20 sm:pt-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-16 bottom-0 -z-10 overflow-hidden">
          <img src={heroDatacenter} alt="" width={1920} height={1088} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-navy/65" />
        </div>
        <Reveal className="max-w-3xl pb-8">
          <p className={eyebrowLight}>AI-POWERED MAINFRAME OPERATIONS</p>
          <h1 className="hero-title mt-5 font-display text-4xl leading-tight text-primary-foreground sm:text-6xl">Mainframe Control Tower</h1>
          <p className="hero-lead mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/90">Monitor batch execution, understand failures, trace downstream impact, and make smarter recovery decisions from one intelligent control tower.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className={btnLight}><Link to="/dashboard">Open Control Tower <ArrowRight size={16} /></Link></Button>
            <Button asChild variant="outline" className={btnGhost}><a href="#product">Explore the Platform</a></Button>
          </div>
        </Reveal>
      </Section>
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-muted-foreground"><span className="icon-tile bg-icon-blue text-primary"><Layers className="h-5 w-5" /></span>Enterprise batch processing</span>
          <p className="font-mono text-xs text-primary">JCL · COBOL · VSAM · JES · SORT · AI · APIs</p>
        </div>
      </div>
    </>
  );
}

function Problem() {
  const steps: [string, string, Status][] = [
    ["JOB FAILURE", "TRN003 abends at STEP03", "failed"],
    ["DOWNSTREAM JOBS", "3 dependent jobs held", "warning"],
    ["BLOCKED PROCESSING", "Billing & risk streams wait", "blocked"],
    ["DELAYED REPORTS", "Morning reports miss SLA", "warning"],
    ["OPERATIONAL IMPACT", "Business teams lack data", "failed"],
  ];
  return (
    <Section id="about" className="bg-secondary/60">
      <div className="grid gap-16 lg:grid-cols-2">
        <Reveal>
          <h2 className={h2}>Mainframe workloads are powerful. <span className="text-muted-foreground">Understanding them shouldn't be difficult.</span></h2>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Enterprise batch environments contain interconnected jobs, datasets, processing steps and dependencies. When one job fails, the impact can extend far beyond the original error.
          </p>
        </Reveal>
        <div className="relative">
          <div className="absolute bottom-6 left-[19px] top-6 w-px bg-border" />
          {steps.map(([t, d, s], i) => (
            <Reveal key={t} delay={i * 90} className="relative flex items-center gap-6 py-4">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card"><Dot s={s} /></span>
              <div className="flex-1 border-b border-border pb-4">
                <p className="font-mono text-xs tracking-[0.18em]">{t}</p>
                <p className="mt-1 text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

const jobs: [string, string, Status, string][] = [
  ["ING001", "Ingestion", "completed", "00:42"],
  ["TRN002", "Transaction", "completed", "01:15"],
  ["TRN003", "Transaction", "failed", "RC=12"],
  ["PRC010", "Processing", "running", "62%"],
  ["BIL004", "Billing", "blocked", "held"],
  ["RSK002", "Risk", "blocked", "held"],
  ["RPT001", "Reporting", "warning", "late"],
];

function Preview() {
  const streams = ["ING", "TRN", "PRC", "BIL", "RSK", "RPT", "ARC", "GL"];
  return (
    <Section id="product">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className={eyebrow}>THE PLATFORM</p>
        <h2 className={`${h2} mt-5`}>One place to understand the entire workload.</h2>
        <p className="mt-6 text-lg text-muted-foreground">See what is running, what has failed, what is blocked, and what happens next.</p>
      </Reveal>
      <Reveal delay={60} className={`${panel} mt-12 overflow-hidden`}>
        <img src={controlRoom} alt="Dark enterprise operations control room with live monitoring dashboards" loading="lazy" width={1920} height={1088} className="h-64 w-full object-cover sm:h-96" />
      </Reveal>
      <Reveal delay={100} className={`${panel} mt-8 overflow-hidden`}>
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-border" /><span className="h-2.5 w-2.5 rounded-full bg-border" /><span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="ml-3 font-mono text-[11px] text-muted-foreground">control-tower / overview — product preview</span>
        </div>
        <div className="grid gap-px bg-border lg:grid-cols-[1fr_1.4fr_1fr]">
          <div className="bg-card p-6">
            <p className={eyebrow}>WORKLOAD STATUS</p>
            <p className="mt-4 font-display text-6xl">47</p>
            <p className="text-sm text-muted-foreground">jobs across 8 streams</p>
            <div className="mt-6 space-y-3 text-sm">
              {([["Completed", 31, "completed"], ["Running", 6, "running"], ["Blocked", 7, "blocked"], ["Failed", 3, "failed"]] as [string, number, Status][]).map(([l, n, s]) => (
                <div key={l} className="flex items-center justify-between"><span className="flex items-center gap-2"><Dot s={s} />{l}</span><span className="font-mono">{n}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-card p-6">
            <p className={eyebrow}>EXECUTION TIMELINE</p>
            <div className="mt-5 space-y-2.5">
              {streams.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-8 font-mono text-[10px] text-muted-foreground">{s}</span>
                  <div className="relative h-3 flex-1 rounded-sm bg-secondary">
                    <div className={`absolute h-3 rounded-sm ${i === 1 ? "bg-destructive/80" : i === 2 ? "bg-accent/80" : i > 3 && i < 6 ? "bg-muted-foreground/30" : "bg-success/70"}`}
                      style={{ left: `${(i * 9) % 40}%`, width: `${30 + ((i * 17) % 35)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-border pt-4"><WorkloadFlowMini /></div>
          </div>
          <div className="bg-card p-6">
            <p className={eyebrow}>RECENT ACTIVITY</p>
            <ul className="mt-4 divide-y divide-border text-sm">
              {jobs.map(([j, n, s, m]) => (
                <li key={j} className="flex items-center justify-between py-2.5">
                  <span className="flex items-center gap-2.5"><Dot s={s} /><span className="font-mono text-xs">{j}</span><span className="text-muted-foreground">{n}</span></span>
                  <span className="font-mono text-[11px] text-muted-foreground">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function WorkloadFlowMini() {
  const xs = [10, 70, 130, 190, 250];
  return (
    <svg viewBox="0 0 280 60" className="w-full" aria-hidden>
      {xs.slice(0, -1).map((x, i) => <line key={x} x1={x + 14} y1={30} x2={(xs[i + 1] ?? x) - 4} y2={30} className="flow-line stroke-navy/30" strokeWidth="1.5" />)}
      {xs.map((x, i) => <rect key={x} x={x - 4} y={20} width="22" height="20" rx="5" className={["fill-success", "fill-destructive", "fill-muted-foreground/40", "fill-muted-foreground/40", "fill-warning"][i]} opacity={0.85} />)}
    </svg>
  );
}

function Features() {
  const items: { t: string; d: string; v: ReactNode }[] = [
    { t: "See every workload.", d: "Track batch execution across multiple workload streams and understand the operational state of your environment.", v: <VisJobs /> },
    { t: "Follow every dependency.", d: "Understand how jobs are connected and quickly identify which downstream workloads are affected by a failure.", v: <VisDeps /> },
    { t: "Understand every failure.", d: "Combine job steps, return codes, error events and execution context to identify probable root causes.", v: <VisFailure /> },
    { t: "Recover with confidence.", d: "AI-assisted recovery recommendations help operators identify appropriate restart points and understand potential downstream impact.", v: <VisRecovery /> },
  ];
  return (
    <div id="how" className="scroll-mt-16">
      {items.map((it, i) => (
        <Section key={it.t} className={i % 2 ? "bg-secondary/60" : ""}>
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <Reveal className={i % 2 ? "lg:order-2" : ""}>
              <span className={`icon-tile ${["bg-icon-blue text-primary", "bg-icon-teal text-ai", "bg-icon-red text-destructive", "bg-icon-green text-success"][i] ?? "bg-icon-blue text-primary"}`}>{(() => { const Icon = [Layers, Network, Sparkles, LifeBuoy][i] ?? Layers; return <Icon className="h-5 w-5" />; })()}</span>
              <h2 className={`${h2} mt-4`}>{it.t}</h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">{it.d}</p>
            </Reveal>
            <Reveal delay={120} className={`${panel} p-6 sm:p-8`}>{it.v}</Reveal>
          </div>
        </Section>
      ))}
    </div>
  );
}

function VisJobs() {
  const rows: [string, Status[]][] = [["Ingestion", ["completed", "completed", "completed", "completed", "completed", "completed"]], ["Transaction", ["completed", "completed", "failed", "blocked", "blocked", "blocked"]], ["Processing", ["completed", "completed", "running", "running", "blocked", "blocked"]], ["Billing", ["completed", "warning", "completed", "blocked", "blocked", "blocked"]], ["Reporting", ["completed", "completed", "completed", "completed", "warning", "blocked"]]];
  return (
    <div className="space-y-4">
      {rows.map(([n, ss]) => (
        <div key={n} className="flex items-center gap-4">
          <span className="w-24 text-sm text-muted-foreground">{n}</span>
          <div className="grid flex-1 grid-cols-6 gap-1.5">{ss.map((s, i) => <div key={i} className={`h-8 rounded-md ${{ completed: "bg-success/70", running: "bg-accent/70 pulse-soft", warning: "bg-warning/80", failed: "bg-destructive/80", blocked: "bg-secondary border border-border" }[s]}`} />)}</div>
        </div>
      ))}
    </div>
  );
}

function VisDeps() {
  return <div className="mx-auto max-w-sm"><WorkloadFlow /></div>;
}

function VisFailure() {
  return (
    <div className="font-mono text-sm">
      <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Dot s="failed" /> TRN003</span><span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs text-destructive">ABEND</span></div>
      <div className="mt-6 space-y-2">
        {[["STEP01", "SORTIN", "RC=00", "completed"], ["STEP02", "VALIDATE", "RC=04", "warning"], ["STEP03", "VSAMWRT", "RC=12", "failed"], ["STEP04", "POSTUPD", "—", "blocked"]].map(([s, p, rc, st]) => (
          <div key={s} className={`flex items-center justify-between rounded-lg border px-4 py-3 ${st === "failed" ? "border-destructive/30 bg-destructive/5" : "border-border"}`}>
            <span className="flex items-center gap-3"><Dot s={st as Status} />{s}<span className="text-muted-foreground">{p}</span></span><span>{rc}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">Event: VSAM DUPLICATE KEY · DSN PROD.TRN.MASTER</p>
    </div>
  );
}

function VisRecovery() {
  return (
    <div>
      <p className={eyebrow}>RECOMMENDED RECOVERY</p>
      <p className="mt-4 font-display text-3xl">Restart TRN003 from STEP03</p>
      <p className="mt-2 text-muted-foreground">after correcting the duplicate transaction record.</p>
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[["Confidence", "High"], ["Jobs released", "3"], ["Est. recovery", "18 min"]].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-border p-3"><p className="font-display text-2xl">{v}</p><p className="mt-1 text-xs text-muted-foreground">{l}</p></div>
        ))}
      </div>
      <div className="mt-6 flex gap-2"><span className={`${btnP} py-2`}>Review restart</span><span className={`${btnS} py-2`}>View impact</span></div>
    </div>
  );
}

function AI() {
  const blocks: [string, ReactNode][] = [
    ["FAILURE", <><span className="text-destructive">TRN003 FAILED</span> · STEP03 · RC=12 · VSAM DUPLICATE KEY</>],
    ["PROBABLE CAUSE", "Duplicate transaction key detected during VSAM write operation."],
    ["IMPACT", "TRN004 · TRN005 · TRN006 held downstream."],
    ["RECOMMENDED RECOVERY", "Restart from STEP03 after correcting the duplicate transaction record."],
  ];
  return (
    <Section id="ai" className="bg-secondary/60">
      <div className="grid gap-16 lg:grid-cols-2">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground">INTELLIGENT ANALYSIS</p>
          <h2 className={`${h2} mt-5`}>Don't just detect a failure. <span className="text-muted-foreground">Understand why it happened.</span></h2>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">AI reads job steps, return codes, error events and dependency context together — and explains what happened in plain language.</p>
        </Reveal>
        <div className="rounded-lg border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground"><span>AI ANALYSIS</span><span className="rounded border border-border px-2 py-0.5">ILLUSTRATIVE EXAMPLE</span></div>
          <div className="mt-6 space-y-3">
            {blocks.map(([t, d], i) => (
              <Reveal key={t} delay={i * 220} className="border-b border-border pb-5">
                <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground">{t}</p>
                <p className={`mt-2 ${i === 0 ? "font-mono text-sm" : "text-base"}`}>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Process() {
  const steps = ["JCL + COBOL + VSAM", "Batch Execution", "Monitoring", "Failure Detection", "AI Analysis", "Impact Analysis", "Recovery Recommendation"];
  return (
    <Section>
      <Reveal className="max-w-3xl"><h2 className={h2}>From batch execution to intelligent recovery.</h2></Reveal>
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-7">
        {steps.map((s, i) => (
          <Reveal key={s} delay={i * 70} className="bg-card p-6">
            <p className="font-mono text-xs text-muted-foreground">0{i + 1}</p>
            <p className="mt-10 text-sm font-medium leading-snug">{s}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Metrics() {
  const m = [["45+", "Simulated batch jobs"], ["8", "Workload streams"], ["100+", "Job dependencies"], ["10K+", "Execution records"], ["500+", "Failure events"], ["50K+", "Dataset records"]];
  return (
    <Section className="bg-secondary/60">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <h2 className={h2}>Designed for complex workloads.</h2>
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground">DEMONSTRATION ENVIRONMENT VALUES</p>
      </Reveal>
      <div className="mt-16 grid grid-cols-2 gap-y-14 border-t border-border pt-14 lg:grid-cols-3">
        {m.map(([n, l], i) => (
          <Reveal key={l} delay={i * 60}>
            <p className="font-display text-7xl tracking-tight sm:text-8xl">{n}</p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{l}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Benefits() {
  const b = [["Faster diagnosis", "Understand failures without searching through disconnected information."], ["Better visibility", "See workload status and downstream impact in one place."], ["Smarter recovery", "Use AI-assisted analysis to support operational decisions."], ["Modern experience", "Bring a contemporary web experience to established mainframe technologies."]];
  return (
    <Section>
      <Reveal className="max-w-3xl"><h2 className={h2}>Modernize the way teams operate legacy workloads.</h2></Reveal>
      <div className="mt-16 grid gap-12 sm:grid-cols-2">
        {b.map(([t, d], i) => (
          <Reveal key={t} delay={i * 80} className="border-t border-foreground/80 pt-6">
            <h3 className="text-xl font-medium">{t}</h3>
            <p className="mt-3 max-w-sm text-muted-foreground">{d}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-24 max-w-3xl">
        <p className="text-lg text-muted-foreground">Built around JCL, COBOL, VSAM and enterprise batch processing — connected to modern APIs, databases, AI and web technologies.</p>
        <p className="mt-4 font-mono text-xs tracking-[0.15em] text-muted-foreground">JCL · COBOL · VSAM · Python · FastAPI · React · PostgreSQL · Redis · AI</p>
      </Reveal>
    </Section>
  );
}

function Enterprise() {
  const l = ["Interconnected workloads", "Dependency-aware monitoring", "Operational reporting", "Role-based access", "Controlled recovery workflows", "Audit-friendly execution history"];
  return (
    <Section className="bg-secondary/60">
      <div className="grid gap-16 lg:grid-cols-2">
        <Reveal><h2 className={h2}>Designed with enterprise operations in mind.</h2></Reveal>
        <ul className="divide-y divide-border border-y border-border">
          {l.map((x, i) => (
            <Reveal key={x} delay={i * 60}><li className="flex items-center justify-between py-5 text-lg"><span>{x}</span><Dot s="completed" /></li></Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function FinalCTA() {
  return (
    <Section>
      <Reveal className={`${panel} relative overflow-hidden px-8 py-20 sm:px-16`}>
        <svg className="pointer-events-none absolute -right-10 top-0 h-full w-1/2 opacity-60" viewBox="0 0 300 300" aria-hidden>
          {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={40 + (i % 3) * 100} cy={50 + Math.floor(i / 3) * 100} r="6" className={i === 4 ? "fill-destructive/60" : "fill-navy/20"} />)}
          {([[0, 1], [1, 2], [0, 4], [4, 8], [3, 4], [4, 5], [2, 5], [6, 7], [7, 8]] as [number, number][]).map(([a, b]) => (
            <line key={`${a}${b}`} x1={40 + (a % 3) * 100} y1={50 + Math.floor(a / 3) * 100} x2={40 + (b % 3) * 100} y2={50 + Math.floor(b / 3) * 100} className="flow-line stroke-navy/20" strokeWidth="1.5" />
          ))}
        </svg>
        <div className="relative max-w-2xl">
          <h2 className={h2}>Make complex batch workloads easier to understand.</h2>
          <p className="mt-6 font-mono text-sm tracking-[0.15em] text-muted-foreground">MONITOR. ANALYZE. UNDERSTAND. RECOVER.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/signup" className={btnP}>Get Started <ArrowRight size={16} /></Link>
            <Link to="/signin" className={btnS}>Sign In</Link>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 py-16">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">AI-powered visibility and intelligent recovery for enterprise batch workloads.</p>
        </div>
        <div className="space-y-2.5 text-sm">
          <p className={eyebrow}>LINKS</p>
          {[["Product", "#product"], ["How It Works", "#how"], ["AI", "#ai"], ["About", "#about"]].map(([l, h]) => <a key={h} href={h} className="block text-muted-foreground hover:text-foreground">{l}</a>)}
          <Link to="/signin" className="block text-muted-foreground hover:text-foreground">Sign In</Link>
          <Link to="/signup" className="block text-muted-foreground hover:text-foreground">Get Started</Link>
        </div>
        <div className="space-y-2.5 text-sm">
          <p className={eyebrow}>TECHNOLOGY</p>
          {["JCL", "COBOL", "VSAM", "AI", "FastAPI", "React"].map((t) => <p key={t} className="text-muted-foreground">{t}</p>)}
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-7xl flex-wrap justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground">
        <span>© 2026 Mainframe Control Tower · Academic / Project Demonstration</span>
      </div>
    </footer>
  );
}
