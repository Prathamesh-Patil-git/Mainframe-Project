import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { appHead } from "@/lib/head";
import { streams, jobs } from "@/lib/demo/data";
import { PageHeader, StatusBadge, StatusDot, SectionTitle, Table, td, DemoBadge } from "@/components/app/ui";

export const Route = createFileRoute("/_app/streams")({
  head: appHead("Batch Streams", "Health and progress of each batch stream in the nightly cycle."),
  component: StreamsPage,
});

function StreamsPage() {
  const [sel, setSel] = useState(streams[1].id);
  const s = streams.find((x) => x.id === sel)!;
  const list = jobs.filter((j) => j.stream === sel);
  return (
    <div>
      <PageHeader title="Batch Streams" subtitle="Grouped workloads and their health" actions={<DemoBadge />} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {streams.map((x) => {
          const done = jobs.filter((j) => j.stream === x.id && j.status === "completed").length;
          const total = jobs.filter((j) => j.stream === x.id).length;
          return (
            <button key={x.id} onClick={() => setSel(x.id)} className={`clay p-4 text-left transition ${sel === x.id ? "ring-2 ring-navy/60" : "hover:-translate-y-0.5"}`}>
              <div className="flex items-center justify-between"><span className="font-mono text-xs text-muted-foreground">{x.prefix}</span><StatusDot s={x.status} /></div>
              <p className="mt-2 font-semibold text-navy">{x.name}</p>
              <p className="mt-3 text-3xl font-semibold">{x.health}%</p>
              <p className="text-xs text-muted-foreground">{x.jobs} jobs · {done}/{total} tracked done</p>
            </button>
          );
        })}
      </div>
      <section className="mt-8">
        <SectionTitle right={<StatusBadge s={s.status} />}>{s.name} · window {s.window}</SectionTitle>
        <Table head={["Job", "Program", "Status", "RC", "Start", "Duration"]}>
          {list.map((j) => (
            <tr key={j.id}>
              <td className={td}><Link to="/jobs/$jobId" params={{ jobId: j.id }} className="font-mono font-medium text-navy hover:underline">{j.id}</Link></td>
              <td className={`${td} font-mono text-xs`}>{j.program}</td><td className={td}><StatusBadge s={j.status} /></td>
              <td className={`${td} font-mono text-xs`}>{j.rc}</td><td className={`${td} font-mono text-xs`}>{j.start}</td><td className={`${td} font-mono text-xs`}>{j.duration}</td>
            </tr>
          ))}
        </Table>
      </section>
    </div>
  );
}
