import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard, ListChecks, Workflow, Network, AlertOctagon, Sparkles, LifeBuoy, FileBarChart,
  Database, Settings, Users, ScrollText, Search, Bell, ChevronDown, PanelLeftClose, PanelLeft, Menu, X, LogOut, User,
} from "lucide-react";
import { Logo } from "@/components/site";
import { readSession, clearSession, type Session } from "@/lib/session";
import { LAST_SYNC, notifications, searchIndex } from "@/lib/demo/data";
import { StatusDot } from "@/components/app/ui";

export const Route = createFileRoute("/_app")({ component: AppLayout });

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; admin?: boolean };
const groups: { title: string; items: NavItem[] }[] = [
  { title: "Overview", items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  { title: "Operations", items: [
    { to: "/jobs", label: "Jobs", icon: ListChecks }, { to: "/streams", label: "Batch Streams", icon: Workflow },
    { to: "/dependencies", label: "Dependencies", icon: Network }, { to: "/failures", label: "Failures", icon: AlertOctagon },
    { to: "/recovery", label: "Recovery", icon: LifeBuoy },
  ] },
  { title: "Insights", items: [
    { to: "/ai-analysis", label: "AI Analysis", icon: Sparkles }, { to: "/reports", label: "Reports", icon: FileBarChart },
    { to: "/datasets", label: "Datasets", icon: Database },
  ] },
  { title: "Administration", items: [
    { to: "/settings", label: "Settings", icon: Settings }, { to: "/admin/users", label: "Users", icon: Users, admin: true },
    { to: "/admin/audit-log", label: "Audit Log", icon: ScrollText, admin: true },
  ] },
];

function AppLayout() {
  const nav = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    // Demo bypass: no real auth yet — fall back to a default session instead of redirecting.
    const s = readSession() ?? { name: "HERC02", username: "HERC02", role: "administrator" as const };
    setSession(s); setReady(true);
  }, [nav]);
  useEffect(() => setMobile(false), [path]);

  if (!ready || !session) return <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-muted-foreground">Loading control tower…</div>;

  const isAdmin = session.role === "administrator";
  const sidebar = (compact: boolean) => (
    <div className="flex h-full flex-col">
      <div className={`flex h-16 items-center ${compact ? "justify-center" : "px-5"}`}>
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3" aria-label="Main">
        {groups.map((g) => {
          const items = g.items.filter((i) => !i.admin || isAdmin);
          if (!items.length) return null;
          return (
            <div key={g.title}>
              {!compact && <p className="px-2 pb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">{g.title}</p>}
              <ul className="space-y-0.5">
                {items.map((i) => {
                  const active = path === i.to || path.startsWith(i.to + "/");
                  return (
                    <li key={i.to}>
                      <Link to={i.to} title={compact ? i.label : undefined}
                        className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition ${compact ? "justify-center" : ""} ${active ? "bg-navy text-primary-foreground shadow-sm" : "text-foreground/75 hover:bg-muted hover:text-foreground"}`}>
                        <i.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                        {!compact && i.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
      {!compact ? (
        <div className="clay m-3 p-3.5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Mainframe connection</p>
          <p className="mt-1.5 flex items-center gap-2 text-sm font-medium"><StatusDot s="completed" /> Connected · MVS-TK5</p>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">Last sync {LAST_SYNC}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">This is currently demo data.</p>
        </div>
      ) : (
        <div className="m-3 flex justify-center py-2" title="Connected · demo data"><StatusDot s="completed" /></div>
      )}
    </div>
  );

  return (
    <div className="internal-app flex min-h-screen bg-surface text-foreground">
      <aside className={`sticky top-0 hidden h-screen shrink-0 border-r border-border bg-card transition-[width] lg:block ${collapsed ? "w-[72px]" : "w-60"}`}>
        {sidebar(collapsed)}
      </aside>
      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setMobile(false)} />
          <aside className="relative h-full w-72 bg-background shadow-xl">
            <button onClick={() => setMobile(false)} className="absolute right-3 top-4 rounded-md p-1.5 hover:bg-muted" aria-label="Close menu"><X className="h-4 w-4" /></button>
            {sidebar(false)}
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card px-4 sm:px-6">
          <button className="rounded-md p-2 hover:bg-muted lg:hidden" onClick={() => setMobile(true)} aria-label="Open menu"><Menu className="h-4 w-4" /></button>
          <button className="hidden rounded-md p-2 text-muted-foreground hover:bg-muted lg:inline-flex" onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar">
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
          <GlobalSearch />
          <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground/80 sm:inline-flex">
            Demo · MVS-TK5
          </span>
          <Notifications />
          <UserMenu session={session} onSignOut={() => { clearSession(); nav({ to: "/signin" }); }} />
        </header>
        <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function useOutside(ref: React.RefObject<HTMLElement | null>, fn: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) fn(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, fn]);
}

function GlobalSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  useOutside(ref, () => setOpen(false));
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); inputRef.current?.focus(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? searchIndex.filter((r) => r.label.toLowerCase().includes(s) || r.hint.toLowerCase().includes(s)).slice(0, 8) : [];
  }, [q]);
  const go = (r: (typeof searchIndex)[number]) => {
    setOpen(false); setQ("");
    if (r.to === "/jobs/$jobId") nav({ to: r.to, params: { jobId: r.id } });
    else nav({ to: r.to });
  };
  return (
    <div ref={ref} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter" && results[0]) go(results[0]); if (e.key === "Escape") setOpen(false); }}
        placeholder="Search jobs, streams, errors, datasets…" aria-label="Global search"
        className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-12 text-sm outline-none transition focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/20" />
      <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground sm:block">⌘K</kbd>
      {open && q && (
        <div className="absolute left-0 right-0 top-11 z-40 overflow-hidden rounded-xl border border-border bg-popover shadow-soft">
          {results.length ? results.map((r) => (
            <button key={r.hint + r.id} onClick={() => go(r)} className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-muted">
              <span className="font-mono">{r.label}</span><span className="text-xs text-muted-foreground">{r.hint}</span>
            </button>
          )) : <p className="px-4 py-3 text-sm text-muted-foreground">No matches for “{q}”.</p>}
        </div>
      )}
    </div>
  );
}

function Notifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative rounded-lg p-2 hover:bg-muted" aria-label="Notifications">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">3</span>
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-40 w-80 rounded-xl border border-border bg-popover p-2 shadow-soft">
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">3 operational events</p>
          {notifications.map((n) => (
            <Link key={n.title} to="/failures" onClick={() => setOpen(false)} className="flex gap-3 rounded-lg px-2 py-2.5 hover:bg-muted">
              <span className="mt-1.5"><StatusDot s={n.status} /></span>
              <span><span className="block text-sm font-medium">{n.title}</span><span className="text-xs text-muted-foreground">{n.body}</span></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function UserMenu({ session, onSignOut }: { session: Session; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutside(ref, () => setOpen(false));
  const roleLabel = session.role === "administrator" ? "Administrator" : "Operator";
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-muted" aria-label="User menu">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy font-mono text-xs text-primary-foreground">{session.username.slice(0, 2)}</span>
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-sm font-medium">{session.username}</span>
          <span className="block text-[11px] text-muted-foreground">{roleLabel}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-40 w-52 rounded-xl border border-border bg-popover p-1.5 text-sm shadow-soft" onClick={() => setOpen(false)}>
          <Link to="/settings" className="flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-muted"><User className="h-4 w-4" /> Profile</Link>
          <Link to="/settings" className="flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-muted"><Settings className="h-4 w-4" /> Settings</Link>
          {session.role === "administrator" && <Link to="/admin/audit-log" className="flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-muted"><ScrollText className="h-4 w-4" /> Audit Log</Link>}
          <button onClick={onSignOut} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" /> Sign Out</button>
        </div>
      )}
    </div>
  );
}
