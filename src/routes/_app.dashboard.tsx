import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { RefreshCw, Sparkles, ArrowRight, AlertOctagon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { appHead } from "@/lib/head";
import { kpis, streams, activityChart, failures, activity, aiAnalysis, LAST_SYNC } from "@/lib/demo/data";
import { useLiveJobs } from "@/lib/live";
import { Kpi, PageHeader, SectionTitle, StatusBadge, StatusDot, statusMeta, DemoBadge, btn } from "@/components/app/ui";

export const Route = createFileRoute("/_app/dashboard")({
  head: appHead("Operations Dashboard", "Live overview of tonight's mainframe batch workload, failures and AI insights."),
  component: Dashboard,
});

function Dashboard() {
  const { jobs, lastEvent } = useLiveJobs();
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 700); };

  return (
    <div>
      <PageHeader
        title="Operations Overview"
        subtitle="Nightly batch cycle · MVS-TK5 · simulated demo data"
        actions={<>
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">Last updated {LAST_SYNC}</span>
          <button className={btn} onClick={refresh}><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh</button>
        </>}
      />
      {lastEvent && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-info/30 bg-info/5 px-3 py-2 text-sm" role="status">
          <StatusDot s="running" /> Live update (simulated): <span className="font-mono">{lastEvent}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => <Kpi key={k.key} {...k} />)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <SectionTitle right={<DemoBadge>Live · simulated</DemoBadge>}>Live workload</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {streams.filter((s) => s.id !== "risk").map((s) => (
              <div key={s.id} className="clay p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-navy">{s.name}</p>
                  <StatusBadge s={s.status} />
                </div>
                <ul className="mt-3 space-y-1.5">
                  {jobs.filter((j) => j.stream === s.id).map((j) => (
                    <li key={j.id}>
                      <Link to="/jobs/$jobId" params={{ jobId: j.id }} className="flex items-center justify-between rounded-md px-2 py-1 font-mono text-xs hover:bg-muted">
                        <span className="flex items-center gap-2"><StatusDot s={j.status} /> {j.id}</span>
                        <span className={statusMeta[j.status].text}>{statusMeta[j.status].glyph} {statusMeta[j.status].label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>AI operations</SectionTitle>
          <div className="clay relative overflow-hidden p-5">
            <div className="absolute inset-x-0 top-0 h-1 bg-ai/70" />
            <div className="flex items-center gap-2 text-ai"><Sparkles className="h-4 w-4" /><span className="text-sm font-semibold">Root cause identified</span></div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{aiAnalysis.job} · confidence {aiAnalysis.confidence}% · illustrative</p>
            <p className="mt-3 text-sm leading-relaxed">Duplicate key <span className="font-mono">00048213-TX</span> in <span className="font-mono">NP.BATCH.JOBMASTER</span> caused VSAM status 22, followed by S0C7.</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Recommended</p>
            <ol className="mt-1 list-decimal space-y-1 pl-4 text-sm">{aiAnalysis.actions.slice(0, 2).map((a) => <li key={a}>{a}</li>)}</ol>
            <Link to="/ai-analysis" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ai hover:underline">Open analysis <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="clay mt-4 border-destructive/20 p-5">
            <div className="flex items-center gap-2 text-destructive"><AlertOctagon className="h-4 w-4" /><span className="text-sm font-semibold">Critical failures</span></div>
            {failures.filter((f) => f.status !== "resolved").slice(0, 2).map((f) => (
              <Link key={f.id} to="/failures" className="mt-3 block rounded-lg bg-surface p-3 hover:bg-muted">
                <div className="flex justify-between font-mono text-xs"><span className="font-semibold">{f.job}</span><span className="text-muted-foreground">{f.time}</span></div>
                <p className="mt-1 text-sm">{f.type}</p>
                <p className="font-mono text-xs text-destructive">{f.code}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <SectionTitle>Workload activity</SectionTitle>
          <div className="flat-panel h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityChart} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} />
                <Area type="monotone" dataKey="completed" stroke="var(--success)" fill="var(--success)" fillOpacity={0.12} strokeWidth={2} />
                <Area type="monotone" dataKey="running" stroke="var(--info)" fill="var(--info)" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="failed" stroke="var(--destructive)" fill="var(--destructive)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section>
          <SectionTitle>Batch stream health</SectionTitle>
          <div className="clay space-y-3.5 p-5">
            {streams.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-sm"><span>{s.name}</span><span className="font-mono text-xs text-muted-foreground">{s.jobs} jobs · {s.health}%</span></div>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted"><div className={`h-full rounded-full ${s.health > 95 ? "bg-success" : s.health > 75 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${s.health}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section>
          <SectionTitle right={<Link to="/dependencies" className="text-xs font-medium text-navy hover:underline">View graph</Link>}>Dependency impact</SectionTitle>
          <div className="flat-panel p-5 font-mono text-xs">
            <p className="flex items-center gap-2 font-semibold text-destructive"><StatusDot s="failed" /> TRN003 failed</p>
            <div className="ml-1 mt-2 space-y-1.5 border-l border-dashed border-border pl-4">
              {["TRN004", "TRN005", "BIL004"].map((x) => <p key={x} className="flex items-center gap-2 text-blocked"><StatusDot s="blocked" /> {x} blocked</p>)}
              <p className="flex items-center gap-2 text-muted-foreground"><StatusDot s="waiting" /> TRN006, REP003 at risk</p>
            </div>
            <p className="mt-4 font-sans text-sm text-muted-foreground">5 downstream jobs impacted · Billing SLA at risk</p>
          </div>
        </section>
        <section>
          <SectionTitle>Execution timeline</SectionTitle>
          <div className="flat-panel space-y-2 p-5">
            {jobs.filter((j) => j.start !== "—").slice(0, 9).map((j, i) => (
              <div key={j.id} className="flex items-center gap-3 font-mono text-[11px]">
                <span className="w-12 text-muted-foreground">{j.id}</span>
                <div className="relative h-2 flex-1 rounded bg-muted">
                  <div className={`absolute h-full rounded ${statusMeta[j.status].dot}`} style={{ left: `${(i * 9) % 70}%`, width: `${12 + (i % 3) * 6}%` }} />
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-1 font-mono text-[10px] text-muted-foreground"><span>20:00</span><span>21:00</span><span>22:00</span><span>23:00</span></div>
          </div>
        </section>
        <section>
          <SectionTitle>Recent activity</SectionTitle>
          <ul className="flat-panel divide-y divide-border">
            {activity.map((a) => (
              <li key={a.time + a.text} className="flex gap-3 px-4 py-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{a.time}</span>
                <span className="mt-1.5"><StatusDot s={a.status} /></span>
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
