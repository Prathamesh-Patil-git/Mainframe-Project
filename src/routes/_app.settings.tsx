import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { appHead } from "@/lib/head";
import { readSession, type Session } from "@/lib/session";
import { PageHeader, SectionTitle, DemoBadge } from "@/components/app/ui";

export const Route = createFileRoute("/_app/settings")({
  head: appHead("Settings", "Profile, notification and connection preferences."),
  component: SettingsPage,
});

function Toggle({ label, def = true }: { label: string; def?: boolean }) {
  const [on, setOn] = useState(def);
  return (
    <label className="flex items-center justify-between py-3 text-sm">
      {label}
      <button role="switch" aria-checked={on} onClick={() => setOn(!on)} className={`relative h-5 w-9 rounded-full transition ${on ? "bg-navy" : "bg-muted-foreground/30"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-card transition ${on ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}

function SettingsPage() {
  const [s, setS] = useState<Session | null>(null);
  useEffect(() => setS(readSession()), []);
  return (
    <div>
      <PageHeader title="Settings" subtitle="Your profile and preferences" actions={<DemoBadge>Not persisted</DemoBadge>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="clay p-6">
          <SectionTitle>Profile</SectionTitle>
          <p className="text-lg font-semibold text-navy">{s?.name}</p>
          <p className="font-mono text-sm text-muted-foreground">{s?.username}</p>
          <p className="mt-2 text-sm capitalize">{s?.role}</p>
        </section>
        <section className="flat-panel divide-y divide-border px-6 py-2">
          <SectionTitle>Notifications</SectionTitle>
          <Toggle label="Job failures" /><Toggle label="Blocked dependencies" /><Toggle label="SLA risk warnings" /><Toggle label="Daily summary email" def={false} />
        </section>
        <section className="clay p-6">
          <SectionTitle>Mainframe connection</SectionTitle>
          <dl className="space-y-2 text-sm">
            {[["System", "MVS-TK5"], ["Adapter", "Not connected (demo)"], ["Sync interval", "30s"], ["Environment", "Demonstration"]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><dt className="text-muted-foreground">{k}</dt><dd className="font-mono">{v}</dd></div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
