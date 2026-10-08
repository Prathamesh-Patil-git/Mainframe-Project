import type { ReactNode } from "react";
import { LayoutDashboard, Layers, Activity, CheckCircle2, AlertTriangle, LockKeyhole, Target, Clock, Timer } from "lucide-react";
import type { JobStatus } from "@/lib/demo/data";

export const statusMeta: Record<JobStatus, { label: string; text: string; bg: string; dot: string; glyph: string }> = {
  completed: { label: "Completed", text: "text-success", bg: "bg-success/10", dot: "bg-success", glyph: "✓" },
  running: { label: "Running", text: "text-info", bg: "bg-info/10", dot: "bg-info", glyph: "●" },
  failed: { label: "Failed", text: "text-destructive", bg: "bg-destructive/10", dot: "bg-destructive", glyph: "✕" },
  blocked: { label: "Blocked", text: "text-blocked", bg: "bg-blocked/10", dot: "bg-blocked", glyph: "⚠" },
  warning: { label: "Warning", text: "text-warning", bg: "bg-warning/15", dot: "bg-warning", glyph: "!" },
  waiting: { label: "Waiting", text: "text-muted-foreground", bg: "bg-muted", dot: "bg-muted-foreground/50", glyph: "○" },
};

export function StatusDot({ s }: { s: JobStatus }) {
  const m = statusMeta[s];
  return (
    <span className="relative inline-flex h-2 w-2">
      {s === "running" && <span className={`pulse-soft absolute inset-0 rounded-full ${m.dot}`} />}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${m.dot}`} />
    </span>
  );
}

export function StatusBadge({ s }: { s: JobStatus }) {
  const m = statusMeta[s];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium ${m.bg} ${m.text}`}>
      <StatusDot s={s} /> {m.label}
    </span>
  );
}

export function DemoBadge({ children = "Demo data" }: { children?: ReactNode }) {
  return <span className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">{children}</span>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="reference-heading mb-6 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <span className="icon-tile bg-icon-blue text-primary"><LayoutDashboard className="h-5 w-5" /></span>
        <div><h1 className="console-title text-2xl text-navy sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}</div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-xs font-semibold uppercase text-foreground/80">{children}</h2>
      {right}
    </div>
  );
}

export function Sparkline({ data, className = "text-navy" }: { data: readonly number[]; className?: string }) {
  const w = 96, h = 28, min = Math.min(...data), max = Math.max(...data), r = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 2 - ((v - min) / r) * (h - 4)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-7 w-24 ${className}`} aria-hidden>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const toneText: Record<string, string> = {
  navy: "text-navy", info: "text-info", success: "text-success", destructive: "text-destructive", blocked: "text-blocked", warning: "text-warning", ai: "text-ai",
};

const kpiIcons: Record<string, typeof Layers> = { "Total jobs": Layers, "Running": Activity, "Completed": CheckCircle2, "Failed": AlertTriangle, "Blocked": LockKeyhole, "Success rate": Target, "Avg processing time": Timer, "Delayed jobs": Clock };
const kpiTile: Record<string, string> = { navy: "bg-icon-blue text-primary", info: "bg-icon-blue text-info", success: "bg-icon-green text-success", destructive: "bg-icon-red text-destructive", blocked: "bg-icon-amber text-blocked", warning: "bg-icon-amber text-warning", ai: "bg-icon-teal text-ai" };

export function Kpi({ label, value, sub, trend, tone }: { label: string; value: string; sub: string; trend: readonly number[]; tone: string }) {
  const Icon = kpiIcons[label] ?? Layers;
  return (
    <div className="console-kpi flex min-w-0 items-start gap-3 p-4">
      <span className={`icon-tile ${kpiTile[tone] ?? kpiTile["navy"]}`}><Icon className="h-[18px] w-[18px]" strokeWidth={1.7} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase leading-relaxed text-muted-foreground">{label}</p>
        <p className="mt-1 font-mono text-[24px] font-medium leading-tight text-navy">{value}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

export const btn = "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";
export const btnPrimarySm = "inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="flat-panel overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-surface text-left">
          <tr>{head.map((h) => <th key={h} className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}
export const td = "whitespace-nowrap px-4 py-2.5";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}
export function TableSkeleton() {
  return <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>;
}
export function Empty({ text }: { text: string }) {
  return <div className="flat-panel p-10 text-center text-sm text-muted-foreground">{text}</div>;
}
