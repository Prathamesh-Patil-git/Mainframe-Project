import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { appHead } from "@/lib/head";
import { jobs, streams } from "@/lib/demo/data";
import { PageHeader, SectionTitle, StatusBadge, statusMeta, DemoBadge } from "@/components/app/ui";

export const Route = createFileRoute("/_app/dependencies")({
  head: appHead("Dependencies", "Job dependency graph showing failure impact across streams."),
  component: DepsPage,
});

const COL_W = 170, ROW_H = 54;
const fill: Record<string, string> = {
  completed: "var(--success)", running: "var(--info)", failed: "var(--destructive)", blocked: "var(--blocked)", waiting: "var(--muted-foreground)", warning: "var(--warning)",
};

function impacted(id: string): Set<string> {
  const out = new Set<string>();
  const walk = (x: string) => jobs.filter((j) => j.dependsOn.includes(x)).forEach((j) => { if (!out.has(j.id)) { out.add(j.id); walk(j.id); } });
  walk(id);
  return out;
}

function DepsPage() {
  const nav = useNavigate();
  const [sel, setSel] = useState("TRN003");
  const imp = impacted(sel);
  const pos = new Map<string, { x: number; y: number }>();
  streams.forEach((s, row) => jobs.filter((j) => j.stream === s.id).forEach((j, col) => pos.set(j.id, { x: 120 + col * COL_W, y: 30 + row * ROW_H * 1.6 })));
  const W = 120 + 6 * COL_W, H = 30 + streams.length * ROW_H * 1.6;
  const selJob = jobs.find((j) => j.id === sel)!;

  return (
    <div>
      <PageHeader title="Dependencies" subtitle="Click a job to trace its downstream impact" actions={<DemoBadge />} />
      <div className="grid gap-6 xl:grid-cols-4">
        <div className="flat-panel overflow-x-auto p-4 xl:col-span-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[900px]" role="img" aria-label="Job dependency graph">
            {streams.map((s, row) => <text key={s.id} x={0} y={30 + row * ROW_H * 1.6 + 22} fontSize="11" fill="var(--muted-foreground)" fontFamily="IBM Plex Mono">{s.prefix}</text>)}
            {jobs.flatMap((j) => j.dependsOn.map((d) => {
              const a = pos.get(d)!, b = pos.get(j.id)!;
              const hot = (d === sel || imp.has(d)) && imp.has(j.id);
              return <path key={d + j.id} d={`M${a.x + 120},${a.y + 18} C${a.x + 150},${a.y + 18} ${b.x - 30},${b.y + 18} ${b.x},${b.y + 18}`}
                fill="none" stroke={hot ? "var(--destructive)" : "var(--border)"} strokeWidth={hot ? 2 : 1.4} className={hot ? "flow-line" : ""} />;
            }))}
            {jobs.map((j) => {
              const p = pos.get(j.id)!; const isSel = j.id === sel; const isImp = imp.has(j.id);
              return (
                <g key={j.id} transform={`translate(${p.x},${p.y})`} onClick={() => setSel(j.id)} onDoubleClick={() => nav({ to: "/jobs/$jobId", params: { jobId: j.id } })} className="cursor-pointer">
                  <rect width="120" height="36" rx="9" fill="var(--card)" stroke={isSel ? "var(--navy)" : isImp ? "var(--blocked)" : "var(--border)"} strokeWidth={isSel || isImp ? 2 : 1} />
                  <circle cx="14" cy="18" r="4" fill={fill[j.status]} />
                  <text x="26" y="22" fontSize="12" fontFamily="IBM Plex Mono" fill="var(--foreground)">{j.id}</text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-xs text-muted-foreground">Double-click a job to open its detail.</p>
        </div>
        <div className="space-y-4">
          <div className="clay p-5">
            <SectionTitle>Selected</SectionTitle>
            <p className="font-mono text-lg font-semibold">{sel}</p>
            <div className="mt-2"><StatusBadge s={selJob.status} /></div>
            <p className="mt-4 text-3xl font-semibold text-blocked">{imp.size}</p>
            <p className="text-xs text-muted-foreground">downstream jobs impacted</p>
          </div>
          <div className="flat-panel p-4">
            <SectionTitle>Impact chain</SectionTitle>
            {imp.size ? [...imp].map((id) => { const j = jobs.find((x) => x.id === id)!; return (
              <p key={id} className={`flex justify-between py-1 font-mono text-xs ${statusMeta[j.status].text}`}><span>{id}</span><span>{statusMeta[j.status].label}</span></p>
            ); }) : <p className="text-sm text-muted-foreground">No downstream jobs.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
