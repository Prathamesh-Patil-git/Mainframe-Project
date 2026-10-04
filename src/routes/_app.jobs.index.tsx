import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { appHead } from "@/lib/head";
import { jobsQuery } from "@/lib/api";
import { streams, type JobStatus } from "@/lib/demo/data";
import { PageHeader, StatusBadge, Table, td, TableSkeleton, Empty, DemoBadge } from "@/components/app/ui";

export const Route = createFileRoute("/_app/jobs/")({
  head: appHead("Jobs", "All batch jobs in the current cycle with status, return codes and timing."),
  component: JobsPage,
});

const statuses: ("all" | JobStatus)[] = ["all", "running", "completed", "failed", "blocked", "waiting"];

function JobsPage() {
  const { data, isLoading } = useQuery(jobsQuery());
  const [q, setQ] = useState("");
  const [st, setSt] = useState<(typeof statuses)[number]>("all");
  const [stream, setStream] = useState("all");
  const [asc, setAsc] = useState(true);
  const rows = useMemo(() => (data ?? [])
    .filter((j) => (st === "all" || j.status === st) && (stream === "all" || j.stream === stream) && (j.id + j.program).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (asc ? 1 : -1) * a.id.localeCompare(b.id)), [data, q, st, stream, asc]);

  return (
    <div>
      <PageHeader title="Jobs" subtitle="Every job in tonight's batch window" actions={<DemoBadge />} />
      <div className="mb-4 flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by job or program" className="h-9 w-56 rounded-lg border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
        <select value={stream} onChange={(e) => setStream(e.target.value)} className="h-9 rounded-lg border border-border bg-card px-2 text-sm">
          <option value="all">All streams</option>{streams.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
          {statuses.map((s) => <button key={s} onClick={() => setSt(s)} className={`rounded-md px-2.5 py-1 text-xs capitalize ${st === s ? "bg-navy text-primary-foreground" : "hover:bg-muted"}`}>{s}</button>)}
        </div>
        <button onClick={() => setAsc((a) => !a)} className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground"><ArrowUpDown className="h-3.5 w-3.5" /> Sort {asc ? "A→Z" : "Z→A"}</button>
      </div>
      {isLoading ? <TableSkeleton /> : rows.length === 0 ? <Empty text="No jobs match these filters." /> : (
        <Table head={["Job", "Program", "Stream", "Status", "Return code", "Start", "Duration", "Depends on"]}>
          {rows.map((j) => (
            <tr key={j.id} className="hover:bg-surface">
              <td className={td}><Link to="/jobs/$jobId" params={{ jobId: j.id }} className="font-mono font-medium text-navy hover:underline">{j.id}</Link></td>
              <td className={`${td} font-mono text-xs`}>{j.program}</td>
              <td className={td}>{streams.find((s) => s.id === j.stream)?.name}</td>
              <td className={td}><StatusBadge s={j.status} /></td>
              <td className={`${td} font-mono text-xs ${j.status === "failed" ? "text-destructive" : ""}`}>{j.rc}</td>
              <td className={`${td} font-mono text-xs`}>{j.start}</td>
              <td className={`${td} font-mono text-xs`}>{j.duration}</td>
              <td className={`${td} font-mono text-xs text-muted-foreground`}>{j.dependsOn.join(", ") || "—"}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
