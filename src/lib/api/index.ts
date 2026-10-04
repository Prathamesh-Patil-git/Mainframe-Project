// Service layer. Today it resolves demo data; later swap each fn for a FastAPI fetch.
import { queryOptions } from "@tanstack/react-query";
import * as demo from "@/lib/demo/data";

const delay = <T,>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(v), ms));

export const jobsQuery = () => queryOptions({ queryKey: ["jobs"], queryFn: () => delay(demo.jobs) });
export const jobQuery = (id: string) =>
  queryOptions({ queryKey: ["jobs", id], queryFn: () => delay(demo.jobs.find((j) => j.id === id) ?? null) });
export const streamsQuery = () => queryOptions({ queryKey: ["streams"], queryFn: () => delay(demo.streams) });
export const failuresQuery = () => queryOptions({ queryKey: ["failures"], queryFn: () => delay(demo.failures) });
export const datasetsQuery = () => queryOptions({ queryKey: ["datasets"], queryFn: () => delay(demo.datasets) });
