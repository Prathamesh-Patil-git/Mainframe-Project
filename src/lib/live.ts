// Simulated live feed. Swap this module for a WebSocket subscription later.
import { useEffect, useState } from "react";
import { jobs as seed, type Job } from "@/lib/demo/data";

const script: { id: string; to: Job["status"]; rc?: string }[] = [
  { id: "BIL003", to: "completed", rc: "0000" },
  { id: "BIL004", to: "running" },
  { id: "ING003", to: "completed", rc: "0000" },
  { id: "ING004", to: "running" },
];

export function useLiveJobs(intervalMs = 15000) {
  const [list, setList] = useState<Job[]>(seed);
  const [last, setLast] = useState<string | null>(null);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      const ev = script[i++];
      if (!ev) return clearInterval(t);
      setList((l) => l.map((j) => (j.id === ev.id ? { ...j, status: ev.to, rc: ev.rc ?? j.rc } : j)));
      setLast(`${ev.id} → ${ev.to.toUpperCase()}`);
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return { jobs: list, lastEvent: last };
}
