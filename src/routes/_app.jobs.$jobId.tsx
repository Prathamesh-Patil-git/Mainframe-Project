import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Sparkles } from "lucide-react";
import { appHead } from "@/lib/head";
import { jobQuery } from "@/lib/api";
import { jobs, steps, sysout, streams, aiAnalysis } from "@/lib/demo/data";
import { PageHeader, StatusBadge, SectionTitle, Table, td, Skeleton, Empty, DemoBadge } from "@/components/app/ui";

export const Route = createFileRoute("/_app/jobs/$jobId")({
  head: ({ params }) => appHead(`Job ${params.jobId}`, `Execution detail, steps and SYSOUT for job ${params.jobId}.`)(),
  component: JobDetail,
});

function JobDetail() {
  const { jobId } = Route.useParams();
  const { data: job, isLoading } = useQuery(jobQuery(jobId));
  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-40" /></div>;
  if (!job) return <Empty text={`Job ${jobId} was not found in this cycle.`} />;
  const failed = job.status === "failed";
  const downstream = jobs.filter((j) => j.dependsOn.includes(job.id));
  const facts = [
    ["Stream", streams.find((s) => s.id === job.stream)?.name], ["Program", job.program], ["Return code", job.rc],
    ["Started", job.start], ["Duration", job.duration], ["Owner", job.owner],
  ];
  return (
    <div>
      <Link to="/jobs" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> All jobs</Link>
      <PageHeader title={job.id} subtitle={`${job.name} · ${job.program}`} actions={<><StatusBadge s={job.status} /><DemoBadge /></>} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {facts.map(([k, v]) => (
          <div key={k} className="clay p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
            <p className={`mt-1 truncate font-mono text-sm font-medium ${k === "Return code" && failed ? "text-destructive" : ""}`}>{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section>
            <SectionTitle>Step execution</SectionTitle>
            <Table head={["Step", "Program", "RC", "CPU", "Elapsed", "Status"]}>
              {(failed ? steps : steps.map((s) => ({ ...s, rc: job.status === "completed" ? "0000" : "—", status: job.status }))).map((s) => (
                <tr key={s.step}>
                  <td className={`${td} font-mono text-xs`}>{s.step}</td><td className={`${td} font-mono text-xs`}>{s.program}</td>
                  <td className={`${td} font-mono text-xs`}>{s.rc}</td><td className={`${td} font-mono text-xs`}>{s.cpu}</td>
                  <td className={`${td} font-mono text-xs`}>{s.elapsed}</td><td className={td}><StatusBadge s={s.status} /></td>
                </tr>
              ))}
            </Table>
          </section>
          <section>
            <SectionTitle>JCL & SYSOUT</SectionTitle>
            <pre className="max-h-96 overflow-auto rounded-xl border border-border bg-navy p-4 font-mono text-xs leading-relaxed text-primary-foreground/90">{failed ? sysout : `IEF403I ${job.name} - STARTED - TIME=${job.start}\n${job.status === "completed" ? `IEF404I ${job.name} - ENDED - RC=${job.rc}` : "… awaiting output"}`}</pre>
          </section>
        </div>
        <div className="space-y-6">
          <section>
            <SectionTitle>Dependencies</SectionTitle>
            <div className="flat-panel p-4 text-sm">
              <p className="font-mono text-[10px] uppercase text-muted-foreground">Upstream</p>
              <p className="mt-1 font-mono">{job.dependsOn.join(", ") || "None"}</p>
              <p className="mt-3 font-mono text-[10px] uppercase text-muted-foreground">Downstream</p>
              <div className="mt-1 flex flex-wrap gap-1.5">{downstream.length ? downstream.map((d) => <Link key={d.id} to="/jobs/$jobId" params={{ jobId: d.id }} className="rounded-md bg-surface px-2 py-0.5 font-mono text-xs hover:bg-muted">{d.id}</Link>) : "None"}</div>
            </div>
          </section>
          {failed && (
            <section className="clay p-5">
              <div className="flex items-center gap-2 text-ai"><Sparkles className="h-4 w-4" /><span className="text-sm font-semibold">AI insight · illustrative</span></div>
              <p className="mt-2 text-sm leading-relaxed">{aiAnalysis.rootCause}</p>
              <Link to="/recovery" className="mt-3 inline-block text-sm font-medium text-ai hover:underline">View recovery plan →</Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
