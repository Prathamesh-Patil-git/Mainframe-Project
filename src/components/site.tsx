import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function Logo({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <Link to="/" className={`flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-ring ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
        <rect x="1" y="1" width="24" height="24" rx="6" className={light ? "fill-primary-foreground" : "fill-navy"} />
        <path d="M8 18V8m5 10V11m5 7v-4" className={light ? "stroke-navy" : "stroke-primary-foreground"} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className={`text-[15px] font-medium tracking-tight ${light ? "text-primary-foreground" : ""}`}>Mainframe Control Tower</span>
    </Link>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export type Status = "completed" | "running" | "warning" | "failed" | "blocked";
export const statusClass: Record<Status, string> = {
  completed: "bg-success",
  running: "bg-accent",
  warning: "bg-warning",
  failed: "bg-destructive",
  blocked: "bg-muted-foreground/40",
};

export function Dot({ s }: { s: Status }) {
  return <span className={`inline-block h-2 w-2 rounded-full ${statusClass[s]} ${s === "running" ? "pulse-soft" : ""}`} />;
}

const fill: Record<Status, string> = {
  completed: "fill-success",
  running: "fill-accent",
  warning: "fill-warning",
  failed: "fill-destructive",
  blocked: "fill-muted-foreground",
};

type N = { id: string; label: string; job: string; x: number; y: number; s: Status };

export function WorkloadFlow({ compact = false }: { compact?: boolean }) {
  const nodes: N[] = [
    { id: "a", label: "INGESTION", job: "ING001", x: 200, y: 40, s: "completed" },
    { id: "b", label: "TRANSACTION", job: "TRN003", x: 200, y: 130, s: "completed" },
    { id: "c", label: "PROCESSING", job: "PRC010", x: 200, y: 220, s: "running" },
    { id: "d", label: "BILLING", job: "BIL004", x: 95, y: 310, s: "warning" },
    { id: "e", label: "RISK", job: "RSK002", x: 305, y: 310, s: "failed" },
    { id: "f", label: "REPORTING", job: "RPT001", x: 200, y: 400, s: "blocked" },
  ];
  const edges: [string, string][] = [["a", "b"], ["b", "c"], ["c", "d"], ["c", "e"], ["d", "f"], ["e", "f"]];
  const get = (id: string) => nodes.find((n) => n.id === id)!;
  return (
    <svg viewBox="0 0 400 440" className="h-auto w-full" role="img" aria-label="Batch workload flow diagram">
      {edges.map(([a, b]) => {
        const A = get(a), B = get(b);
        return (
          <path key={a + b} d={`M${A.x} ${A.y + 18} C ${A.x} ${(A.y + B.y) / 2}, ${B.x} ${(A.y + B.y) / 2}, ${B.x} ${B.y - 18}`}
            className="flow-line stroke-navy/30" strokeWidth="1.5" fill="none" />
        );
      })}
      {nodes.map((n) => (
        <g key={n.id} transform={`translate(${n.x - 72} ${n.y - 18})`}>
          <rect width="144" height="36" rx="8" className="fill-card stroke-border" strokeWidth="1" />
          <circle cx="16" cy="18" r="4" className={`${fill[n.s]} ${n.s === "running" ? "pulse-soft" : ""}`} />
          <text x="28" y="16" className="fill-foreground font-mono" fontSize="9.5" fontWeight="500">{n.label}</text>
          {!compact && <text x="28" y="27" className="fill-muted-foreground font-mono" fontSize="8">{n.job} · {n.s}</text>}
        </g>
      ))}
    </svg>
  );
}
