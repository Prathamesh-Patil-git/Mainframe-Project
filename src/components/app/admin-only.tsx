import { useEffect, useState, type ReactNode } from "react";
import { readSession } from "@/lib/session";
import { Empty } from "./ui";

export function AdminOnly({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => setRole(readSession()?.role ?? "operator"), []);
  if (role === null) return null;
  return role === "administrator" ? <>{children}</> : <Empty text="This page is available to administrators only." />;
}
