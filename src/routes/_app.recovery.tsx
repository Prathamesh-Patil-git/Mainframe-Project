import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Circle } from "lucide-react";
import { appHead } from "@/lib/head";
import { recoveryPlans } from "@/lib/demo/data";
import { readSession } from "@/lib/session";
import { PageHeader, DemoBadge, btn, btnPrimarySm } from "@/components/app/ui";

export const Route = createFileRoute("/_app/recovery")({
  head: appHead("Recovery", "Recovery plans, step tracking and approvals for failed jobs."),
  component: RecoveryPage,
});

function RecoveryPage() {
  const [states, setStates] = useState<Record<string, string>>(Object.fromEntries(recoveryPlans.map((p) => [p.id, p.state])));
  const isAdmin = typeof window !== "undefined" && readSession()?.role === "administrator";
  return (
    <div>
      <PageHeader title="Recovery" subtitle="Guided recovery for failed workloads" actions={<DemoBadge>Simulated actions</DemoBadge>} />
      <div className="grid gap-6 lg:grid-cols-2">
        {recoveryPlans.map((p) => {
          const st = states[p.id];
          return (
            <div key={p.id} className="clay p-6">
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground"><span>{p.id} · {p.job}</span>
                <span className={`rounded-full px-2 py-0.5 capitalize ${st === "completed" ? "bg-success/10 text-success" : st === "approved" ? "bg-info/10 text-info" : "bg-warning/15 text-foreground"}`}>{st}</span></div>
              <h2 className="mt-2 text-lg font-semibold text-navy">{p.title}</h2>
              <ol className="mt-4 space-y-2.5">
                {p.steps.map((s) => (
                  <li key={s.text} className="flex items-center gap-3 text-sm">
                    {s.done ? <Check className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                    <span className={s.done ? "text-muted-foreground line-through" : ""}>{s.text}</span>
                  </li>
                ))}
              </ol>
              {st === "awaiting approval" && (
                <div className="mt-6 flex gap-2">
                  <button className={btnPrimarySm} disabled={!isAdmin} onClick={() => setStates((x) => ({ ...x, [p.id]: "approved" }))}>Approve (demo)</button>
                  <button className={btn} onClick={() => setStates((x) => ({ ...x, [p.id]: "rejected" }))}>Reject</button>
                  {!isAdmin && <span className="self-center text-xs text-muted-foreground">Administrator approval required</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
