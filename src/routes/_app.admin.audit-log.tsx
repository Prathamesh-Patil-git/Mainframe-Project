import { createFileRoute } from "@tanstack/react-router";
import { appHead } from "@/lib/head";
import { audit } from "@/lib/demo/data";
import { PageHeader, Table, td, DemoBadge } from "@/components/app/ui";
import { AdminOnly } from "@/components/app/admin-only";

export const Route = createFileRoute("/_app/admin/audit-log")({
  head: appHead("Audit Log", "Chronological record of operator and system actions."),
  component: () => <AdminOnly><AuditPage /></AdminOnly>,
});

function AuditPage() {
  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Who did what, and when" actions={<DemoBadge />} />
      <Table head={["Time", "User", "Action", "Target"]}>
        {audit.map((a) => (
          <tr key={a.time + a.action}>
            <td className={`${td} font-mono text-xs`}>{a.time}</td><td className={`${td} font-mono text-xs`}>{a.user}</td>
            <td className={td}>{a.action}</td><td className={`${td} font-mono text-xs text-muted-foreground`}>{a.target}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
