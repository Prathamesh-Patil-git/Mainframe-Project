import { createFileRoute } from "@tanstack/react-router";
import { appHead } from "@/lib/head";
import { users } from "@/lib/demo/data";
import { PageHeader, Table, td, DemoBadge } from "@/components/app/ui";
import { AdminOnly } from "@/components/app/admin-only";

export const Route = createFileRoute("/_app/admin/users")({
  head: appHead("Users", "Manage operator and administrator access."),
  component: () => <AdminOnly><UsersPage /></AdminOnly>,
});

function UsersPage() {
  return (
    <div>
      <PageHeader title="Users" subtitle="Operators and administrators" actions={<DemoBadge />} />
      <Table head={["Name", "Username", "Role", "Status", "Last active"]}>
        {users.map((u) => (
          <tr key={u.username}>
            <td className={`${td} font-medium`}>{u.name}</td><td className={`${td} font-mono text-xs`}>{u.username}</td><td className={td}>{u.role}</td>
            <td className={td}><span className={`rounded-full px-2 py-0.5 text-xs ${u.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{u.status}</span></td>
            <td className={`${td} text-muted-foreground`}>{u.last}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
