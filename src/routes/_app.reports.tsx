import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { appHead } from "@/lib/head";
import { weekly } from "@/lib/demo/data";
import { PageHeader, SectionTitle, DemoBadge, btn } from "@/components/app/ui";

export const Route = createFileRoute("/_app/reports")({
  head: appHead("Reports", "Weekly batch success rate, volume and processing time trends."),
  component: ReportsPage,
});

const axis = { tick: { fontSize: 11, fill: "var(--muted-foreground)" }, axisLine: false, tickLine: false };

function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" subtitle="Last 7 batch cycles" actions={<><DemoBadge /><button className={btn} disabled title="Export available once connected"><Download className="h-3.5 w-3.5" /> Export PDF</button></>} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["Avg success", "94.3%"], ["Jobs run", "308"], ["Avg duration", "19m 01s"], ["Incidents", "4"]].map(([l, v]) => (
          <div key={l} className="clay p-4"><p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{l}</p><p className="mt-1 text-3xl font-semibold text-navy">{v}</p></div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section><SectionTitle>Success rate %</SectionTitle>
          <div className="flat-panel h-72 p-4"><ResponsiveContainer><LineChart data={weekly} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /><XAxis dataKey="d" {...axis} /><YAxis domain={[85, 100]} {...axis} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} /><Line dataKey="success" stroke="var(--success)" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart></ResponsiveContainer></div></section>
        <section><SectionTitle>Avg processing minutes</SectionTitle>
          <div className="flat-panel h-72 p-4"><ResponsiveContainer><BarChart data={weekly} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /><XAxis dataKey="d" {...axis} /><YAxis {...axis} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} /><Bar dataKey="minutes" fill="var(--navy)" radius={[6, 6, 0, 0]} />
          </BarChart></ResponsiveContainer></div></section>
      </div>
    </div>
  );
}
