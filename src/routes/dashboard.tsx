import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/site";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Mainframe Control Tower" },
      { name: "description", content: "The Mainframe Control Tower dashboard is coming in the next phase." },
      { property: "og:title", content: "Dashboard — Mainframe Control Tower" },
      { property: "og:description", content: "Dashboard experience coming in the next phase." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col px-6 py-6 sm:px-10">
      <Logo />
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground">PHASE 2</p>
        <h1 className="mt-4 font-display text-5xl">Mainframe Control Tower Dashboard</h1>
        <p className="mt-4 text-muted-foreground">Dashboard experience coming in the next phase.</p>
        <Link to="/" className="mt-8 text-sm font-medium underline-offset-4 hover:underline">← Back to home</Link>
      </div>
    </div>
  );
}
