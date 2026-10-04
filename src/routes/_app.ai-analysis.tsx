import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, CheckCircle2, FileSearch } from "lucide-react";
import { appHead } from "@/lib/head";
import { aiAnalysis, sysout } from "@/lib/demo/data";
import { PageHeader, SectionTitle, DemoBadge, btnPrimarySm } from "@/components/app/ui";

export const Route = createFileRoute("/_app/ai-analysis")({
  head: appHead("AI Analysis", "AI-assisted root-cause analysis and recommended recovery actions."),
  component: AiPage,
});

function AiPage() {
  const a = aiAnalysis;
  return (
    <div>
      <PageHeader title="AI Analysis" subtitle={`Root-cause analysis for ${a.job}`} actions={<DemoBadge>Illustrative example</DemoBadge>} />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section className="clay relative overflow-hidden p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-ai/70" />
            <div className="flex items-center gap-2 text-ai"><Sparkles className="h-5 w-5" /><h2 className="text-lg font-semibold">Probable root cause</h2></div>
            <p className="mt-3 leading-relaxed">{a.rootCause}</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-muted"><div className="h-full rounded-full bg-ai" style={{ width: `${a.confidence}%` }} /></div>
              <span className="font-mono text-sm">{a.confidence}% confidence</span>
            </div>
          </section>
          <section>
            <SectionTitle>Evidence</SectionTitle>
            <ul className="flat-panel divide-y divide-border">
              {a.evidence.map((e) => <li key={e} className="flex gap-3 px-4 py-3 text-sm"><FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><span className="font-mono text-xs leading-relaxed">{e}</span></li>)}
            </ul>
          </section>
          <section>
            <SectionTitle>Log excerpt analysed</SectionTitle>
            <pre className="max-h-72 overflow-auto rounded-xl border border-border bg-navy p-4 font-mono text-xs leading-relaxed text-primary-foreground/90">{sysout.split("\n").slice(6).join("\n")}</pre>
          </section>
        </div>
        <section className="clay h-fit p-6">
          <SectionTitle>Recommended actions</SectionTitle>
          <ol className="space-y-3">
            {a.actions.map((x, i) => (
              <li key={x} className="flex gap-3 text-sm"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ai/10 font-mono text-xs text-ai">{i + 1}</span>{x}</li>
            ))}
          </ol>
          <Link to="/recovery" className={`${btnPrimarySm} mt-6 w-full justify-center`}><CheckCircle2 className="h-4 w-4" /> Open recovery plan</Link>
          <p className="mt-3 text-xs text-muted-foreground">Analysis is a demonstration. No AI service is connected yet.</p>
        </section>
      </div>
    </div>
  );
}
