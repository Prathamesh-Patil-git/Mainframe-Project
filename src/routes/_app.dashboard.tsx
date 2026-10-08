import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { RefreshCw, Sparkles, ArrowRight, AlertOctagon, ListChecks, Network, LifeBuoy } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { appHead } from "@/lib/head";
import { kpis, streams, activityChart, activity, aiAnalysis, LAST_SYNC } from "@/lib/demo/data";
import { Button } from "@/components/ui/button";
import { useLiveJobs } from "@/lib/live";
import { Kpi, PageHeader, SectionTitle, StatusBadge, StatusDot, statusMeta, DemoBadge } from "@/components/app/ui";

export const Route = createFileRoute("/_app/dashboard")({
  head: appHead("Operations Dashboard", "Live overview of tonight's mainframe batch workload, failures and AI insights."),
  component: Dashboard,
});

function Dashboard() {
  const { jobs, lastEvent } = useLiveJobs();
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 700); };
  const priorityJobs = [...jobs.filter((j) => j.status === "failed" || j.status === "blocked" || j.status === "running"), ...jobs.filter((j) => j.status === "waiting")].slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader title="Operations Overview" subtitle="Nightly batch cycle · MVS-TK5 · simulated demo data" actions={<>
        <span className="hidden font-mono text-xs text-muted-foreground sm:inline">Last sync {LAST_SYNC}</span>
        <Button variant="outline" size="sm" onClick={refresh}><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh</Button>
      </>} />
      {lastEvent && <div className="flex items-center gap-2 border-l-2 border-info bg-info/5 px-3 py-2 text-sm" role="status"><StatusDot s="running" /> Simulated update: <span className="font-mono">{lastEvent}</span></div>}

      <section aria-label="Operations shortcuts" className="grid gap-4 md:grid-cols-3">
        {[
          { to: "/jobs", title: "Browse jobs", description: "Batch execution, job steps and return codes.", icon: ListChecks, tone: "bg-icon-blue text-primary" },
          { to: "/dependencies", title: "Trace dependencies", description: "Connected workloads and downstream impact.", icon: Network, tone: "bg-icon-teal text-ai" },
          { to: "/recovery", title: "Review recovery", description: "Restart plans and operator approvals.", icon: LifeBuoy, tone: "bg-icon-green text-success" },
        ].map((item) => <Link key={item.to} to={item.to} className="reference-heading block p-5 transition hover:border-ring/40 hover:bg-surface">
          <span className={`icon-tile ${item.tone}`}><item.icon className="h-5 w-5" strokeWidth={1.7} /></span>
          <h2 className="mt-4 text-base font-semibold">{item.title}</h2>
          <p className="mt-1 min-h-10 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">Open <ArrowRight className="h-3.5 w-3.5" /></span>
        </Link>)}
      </section>
      <section aria-label="Batch summary">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map(({ key, ...k }) => <Kpi key={key} {...k} />)}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.65fr)_minmax(0,1fr)]">
        <section className="min-w-0">
          <SectionTitle right={<Link to="/streams" className="text-xs font-medium text-ai hover:underline">All streams →</Link>}>Batch streams</SectionTitle>
          <div className="console-panel divide-y divide-border overflow-hidden">
            {streams.map((s) => (
              <Link to="/streams" key={s.id} className="block px-4 py-3.5 transition hover:bg-surface">
                <div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{s.name}</span><StatusDot s={s.status} /></div>
                <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-muted-foreground"><span>{s.prefix} · {s.jobs} jobs</span><span>{s.health}% health</span></div>
                <div className="mt-2 h-1 bg-muted"><div className={`h-full ${s.health > 95 ? "bg-success" : s.health > 75 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${s.health}%` }} /></div>
              </Link>
            ))}
          </div>
          <div className="mt-4 border-l-2 border-blocked bg-blocked/5 p-4">
            <p className="text-xs font-semibold uppercase text-blocked">Dependency impact</p>
            <p className="mt-2 text-sm"><span className="font-mono font-semibold">TRN003</span> failure holds 3 downstream jobs. Billing SLA at risk.</p>
            <Link to="/dependencies" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-ai hover:underline">View dependencies <ArrowRight className="h-3 w-3" /></Link>
          </div>
        </section>

        <section className="min-w-0">
          <SectionTitle right={<DemoBadge>Live · simulated</DemoBadge>}>Job queue · attention first</SectionTitle>
          <div className="console-panel overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface text-[11px] uppercase text-muted-foreground"><tr><th className="px-4 py-3 font-semibold">Job / program</th><th className="px-3 py-3 font-semibold">Stream</th><th className="px-3 py-3 font-semibold">Status</th></tr></thead>
              <tbody className="divide-y divide-border">
                {priorityJobs.map((j) => <tr key={j.id} className="hover:bg-surface"><td className="px-4 py-3"><Link to="/jobs/$jobId" params={{ jobId: j.id }} className="font-mono font-semibold text-navy hover:underline">{j.id}</Link><span className="block font-mono text-[11px] text-muted-foreground">{j.program}</span></td><td className="px-3 py-3 text-xs">{streams.find((s) => s.id === j.stream)?.name}</td><td className="px-3 py-3"><StatusBadge s={j.status} /></td></tr>)}
              </tbody>
            </table>
            <Link to="/jobs" className="flex items-center justify-center gap-1 border-t border-border py-3 text-xs font-semibold text-ai hover:bg-surface">View all jobs <ArrowRight className="h-3 w-3" /></Link>
          </div>
        </section>

        <section className="min-w-0">
          <SectionTitle>Incident brief</SectionTitle>
          <div className="reference-heading overflow-hidden p-5 text-foreground">
            <div className="flex items-center gap-2 text-sm font-semibold"><span className="icon-tile bg-icon-red text-destructive"><AlertOctagon className="h-4 w-4" /></span> TRN003 · S0C7</div>
            <p className="mt-2 break-words text-sm leading-relaxed text-muted-foreground">VSAM duplicate key in NP.BATCH.JOBMASTER. Transaction processing is held.</p>
            <div className="my-4 border-t border-border" />
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">Affected jobs</p>
            <p className="mt-1 font-mono text-xs">TRN004 · TRN005 · BIL004</p>
            <Link to="/failures" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">Review failures <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="console-panel mt-4 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ai"><span className="icon-tile bg-icon-teal text-ai"><Sparkles className="h-4 w-4" /></span> AI analysis <span className="ml-auto font-mono text-[10px] font-normal text-muted-foreground">Illustrative</span></div>
            <p className="mt-2 break-words text-sm leading-relaxed">Likely duplicate record key <span className="font-mono text-xs">00048213-TX</span>.</p>
            <p className="mt-2 text-xs text-muted-foreground">{aiAnalysis.confidence}% confidence · review evidence before recovery.</p>
            <Link to="/ai-analysis" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ai hover:underline">Open analysis <ArrowRight className="h-3 w-3" /></Link>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section className="min-w-0"><SectionTitle>Workload activity</SectionTitle><div className="console-panel h-64 p-4">
          <ResponsiveContainer width="100%" height="100%"><AreaChart data={activityChart} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="t" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid var(--border)", fontSize: 12 }} />
            <Area type="monotone" dataKey="completed" stroke="var(--success)" fill="var(--success)" fillOpacity={0.08} strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="running" stroke="var(--info)" fill="var(--info)" fillOpacity={0.06} strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="failed" stroke="var(--destructive)" fill="var(--destructive)" fillOpacity={0.04} strokeWidth={2} isAnimationActive={false} />
          </AreaChart></ResponsiveContainer>
        </div></section>
        <section><SectionTitle>Recent activity</SectionTitle><ul className="console-panel divide-y divide-border">
          {activity.map((a) => <li key={a.time + a.text} className="flex gap-3 px-4 py-3 text-sm"><span className="shrink-0 font-mono text-xs text-muted-foreground">{a.time}</span><span className="mt-1.5"><StatusDot s={a.status} /></span><span>{a.text}</span></li>)}
        </ul></section>
      </div>
      <section><SectionTitle>Execution timeline</SectionTitle><div className="console-panel grid gap-2 p-5 sm:grid-cols-2 lg:grid-cols-4">{jobs.filter((j) => j.start !== "—").slice(0, 8).map((j) => <Link key={j.id} to="/jobs/$jobId" params={{ jobId: j.id }} className="flex items-center justify-between border-b border-border py-2 font-mono text-xs hover:text-ai"><span>{j.id}</span><span className={`flex items-center gap-2 ${statusMeta[j.status].text}`}><StatusDot s={j.status} />{j.start}</span></Link>)}</div></section>
    </div>
  );
}
