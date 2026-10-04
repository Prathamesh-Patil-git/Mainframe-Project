import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { appHead } from "@/lib/head";
import { failuresQuery } from "@/lib/api";
import { PageHeader, Table, td, TableSkeleton, DemoBadge } from "@/components/app/ui";

export const Route = createFileRoute("/_app/failures")({
  head: appHead("Failures", "Abends, return-code failures and SLA risks with downstream impact."),
  component: FailuresPage,
});

const sev = { critical: "bg-destructive/10 text-destructive", high: "bg-blocked/10 text-blocked", medium: "bg-warning/15 text-foreground" };

function FailuresPage() {
  const { data, isLoading } = useQuery(failuresQuery());
  const open = (data ?? []).filter((f) => f.status !== "resolved");
  return (
    <div>
      <PageHeader title="Failures" subtitle="What failed, why, and what it affects" actions={<DemoBadge />} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["Open", open.length, "text-destructive"], ["Critical", open.filter((f) => f.severity === "critical").length, "text-destructive"],
          ["Jobs impacted", open.reduce((n, f) => n + f.affected.length, 0), "text-blocked"], ["Resolved (24h)", (data ?? []).length - open.length, "text-success"]].map(([l, v, c]) => (
          <div key={l as string} className="clay p-4"><p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{l}</p><p className={`mt-1 text-3xl font-semibold ${c}`}>{v}</p></div>
        ))}
      </div>
      {isLoading ? <TableSkeleton /> : (
        <Table head={["ID", "Job", "Severity", "Code", "Type", "Detected", "Affected", "Status", ""]}>
          {data!.map((f) => (
            <tr key={f.id} className="hover:bg-surface">
              <td className={`${td} font-mono text-xs`}>{f.id}</td>
              <td className={td}><Link to="/jobs/$jobId" params={{ jobId: f.job }} className="font-mono font-medium text-navy hover:underline">{f.job}</Link></td>
              <td className={td}><span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${sev[f.severity]}`}>{f.severity}</span></td>
              <td className={`${td} font-mono text-xs text-destructive`}>{f.code}</td>
              <td className={td}>{f.type}</td>
              <td className={`${td} font-mono text-xs`}>{f.time}</td>
              <td className={`${td} font-mono text-xs text-muted-foreground`}>{f.affected.join(", ") || "—"}</td>
              <td className={`${td} text-xs capitalize`}>{f.status}</td>
              <td className={td}>{f.status !== "resolved" && <Link to="/ai-analysis" className="text-xs font-medium text-ai hover:underline">Analyse</Link>}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
