import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { appHead } from "@/lib/head";
import { datasetsQuery } from "@/lib/api";
import { PageHeader, StatusBadge, Table, td, TableSkeleton, DemoBadge } from "@/components/app/ui";

export const Route = createFileRoute("/_app/datasets")({
  head: appHead("Datasets", "VSAM, sequential and GDG datasets used by tonight's batch jobs."),
  component: DatasetsPage,
});

function DatasetsPage() {
  const { data, isLoading } = useQuery(datasetsQuery());
  return (
    <div>
      <PageHeader title="Datasets" subtitle="Files read and written by batch jobs" actions={<DemoBadge />} />
      {isLoading ? <TableSkeleton /> : (
        <Table head={["Dataset", "Type", "Size", "Records", "Last updated", "Status", "Used by"]}>
          {data!.map((d) => (
            <tr key={d.name} className="hover:bg-surface">
              <td className={`${td} font-mono text-xs font-medium text-navy`}>{d.name}</td><td className={td}>{d.type}</td>
              <td className={`${td} font-mono text-xs`}>{d.size}</td><td className={`${td} font-mono text-xs`}>{d.records}</td>
              <td className={`${td} font-mono text-xs`}>{d.updated}</td><td className={td}><StatusBadge s={d.status} /></td>
              <td className={`${td} font-mono text-xs text-muted-foreground`}>{d.usedBy}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
