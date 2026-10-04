// Simulated demo data. Replace with FastAPI responses via src/lib/api.
export type JobStatus = "completed" | "running" | "failed" | "blocked" | "waiting" | "warning";
export type Job = {
  id: string; name: string; stream: string; status: JobStatus; rc: string;
  start: string; duration: string; program: string; owner: string; dependsOn: string[];
};
export type Stream = { id: string; name: string; prefix: string; jobs: number; health: number; status: JobStatus; window: string };

export const LAST_SYNC = "22:08:31";

export const streams: Stream[] = [
  { id: "ingestion", name: "Data Ingestion", prefix: "ING", jobs: 12, health: 100, status: "completed", window: "20:00–21:10" },
  { id: "transaction", name: "Transaction Processing", prefix: "TRN", jobs: 18, health: 61, status: "failed", window: "21:10–23:30" },
  { id: "billing", name: "Billing", prefix: "BIL", jobs: 9, health: 82, status: "warning", window: "22:00–23:45" },
  { id: "risk", name: "Risk Analytics", prefix: "RSK", jobs: 6, health: 100, status: "running", window: "22:15–00:30" },
  { id: "reporting", name: "Reporting", prefix: "REP", jobs: 8, health: 94, status: "running", window: "23:00–01:00" },
];

const j = (id: string, stream: string, status: JobStatus, rc: string, start: string, duration: string, program: string, dependsOn: string[] = []): Job =>
  ({ id, name: `NP${id}`, stream, status, rc, start, duration, program, owner: "BATCHOPS", dependsOn });

export const jobs: Job[] = [
  j("ING001", "ingestion", "completed", "0000", "20:02:11", "6m 12s", "INGLOAD"),
  j("ING002", "ingestion", "completed", "0000", "20:08:40", "11m 05s", "INGVAL", ["ING001"]),
  j("ING003", "ingestion", "running", "—", "21:58:02", "10m 29s", "INGMERGE", ["ING002"]),
  j("ING004", "ingestion", "waiting", "—", "—", "—", "INGARCH", ["ING003"]),
  j("TRN001", "transaction", "completed", "0000", "21:10:00", "14m 51s", "TRNSORT", ["ING002"]),
  j("TRN002", "transaction", "completed", "0004", "21:25:03", "22m 18s", "TRNEDIT", ["TRN001"]),
  j("TRN003", "transaction", "failed", "S0C7 / VSAM 22", "21:47:30", "3m 44s", "TRNPOST", ["TRN002"]),
  j("TRN004", "transaction", "blocked", "—", "—", "—", "TRNAGG", ["TRN003"]),
  j("TRN005", "transaction", "blocked", "—", "—", "—", "TRNRECON", ["TRN003"]),
  j("TRN006", "transaction", "waiting", "—", "—", "—", "TRNCLOSE", ["TRN004", "TRN005"]),
  j("BIL001", "billing", "completed", "0000", "22:00:04", "8m 10s", "BILEXTR"),
  j("BIL002", "billing", "completed", "0000", "22:08:20", "9m 31s", "BILRATE", ["BIL001"]),
  j("BIL003", "billing", "running", "—", "22:17:55", "4m 02s", "BILCALC", ["BIL002"]),
  j("BIL004", "billing", "blocked", "—", "—", "—", "BILINV", ["BIL003", "TRN005"]),
  j("RSK001", "risk", "completed", "0000", "22:15:00", "12m 40s", "RSKSCORE"),
  j("RSK002", "risk", "running", "—", "22:27:44", "6m 15s", "RSKAGG", ["RSK001"]),
  j("REP001", "reporting", "completed", "0000", "21:00:00", "5m 22s", "REPDAILY"),
  j("REP002", "reporting", "running", "—", "22:04:12", "18m 01s", "REPGL", ["REP001"]),
  j("REP003", "reporting", "waiting", "—", "—", "—", "REPMGMT", ["REP002", "TRN006"]),
  j("REP004", "reporting", "waiting", "—", "—", "—", "REPREG", ["REP003"]),
];

export const kpis = [
  { key: "total", label: "Total jobs", value: "45", sub: "Tonight's batch window", trend: [38, 40, 41, 43, 44, 45, 45], tone: "navy" },
  { key: "running", label: "Running", value: "6", sub: "2 started recently", trend: [3, 4, 6, 5, 7, 6, 6], tone: "info" },
  { key: "completed", label: "Completed", value: "32", sub: "71.1% of workload", trend: [12, 16, 20, 24, 27, 30, 32], tone: "success" },
  { key: "failed", label: "Failed", value: "1", sub: "TRN003 · S0C7", trend: [0, 0, 0, 0, 1, 1, 1], tone: "destructive" },
  { key: "blocked", label: "Blocked", value: "3", sub: "3 affected by TRN003", trend: [0, 0, 0, 1, 2, 3, 3], tone: "blocked" },
  { key: "success", label: "Success rate", value: "91.2%", sub: "+1.4% vs 7-day avg", trend: [88, 89, 90, 92, 91, 90, 91.2], tone: "success" },
  { key: "avg", label: "Avg processing time", value: "18m 42s", sub: "−52s vs yesterday", trend: [21, 20, 19.5, 19, 19.2, 18.9, 18.7], tone: "navy" },
  { key: "delayed", label: "Delayed jobs", value: "2", sub: "Requires attention", trend: [0, 1, 1, 2, 1, 2, 2], tone: "warning" },
] as const;

export const activityChart = [
  { t: "20:00", completed: 2, running: 2, failed: 0 }, { t: "20:30", completed: 5, running: 3, failed: 0 },
  { t: "21:00", completed: 9, running: 4, failed: 0 }, { t: "21:30", completed: 15, running: 5, failed: 0 },
  { t: "22:00", completed: 24, running: 6, failed: 1 }, { t: "22:08", completed: 32, running: 6, failed: 1 },
];

export const weekly = [
  { d: "Mon", success: 96.1, jobs: 44, minutes: 19.4 }, { d: "Tue", success: 94.3, jobs: 45, minutes: 19.0 },
  { d: "Wed", success: 97.8, jobs: 45, minutes: 18.2 }, { d: "Thu", success: 89.5, jobs: 46, minutes: 21.1 },
  { d: "Fri", success: 93.0, jobs: 45, minutes: 19.6 }, { d: "Sat", success: 98.2, jobs: 38, minutes: 16.8 },
  { d: "Sun", success: 91.2, jobs: 45, minutes: 18.7 },
];

export type Failure = { id: string; job: string; severity: "critical" | "high" | "medium"; code: string; type: string; time: string; affected: string[]; status: "open" | "analysing" | "recovery pending" | "resolved" };
export const failures: Failure[] = [
  { id: "F-1042", job: "TRN003", severity: "critical", code: "S0C7 · VSAM RC 22", type: "VSAM Duplicate Key", time: "21:51:14", affected: ["TRN004", "TRN005", "BIL004", "TRN006", "REP003"], status: "analysing" },
  { id: "F-1041", job: "BIL004", severity: "high", code: "Dependency hold", type: "Upstream failure", time: "22:02:40", affected: ["REP004"], status: "open" },
  { id: "F-1039", job: "REP002", severity: "medium", code: "SLA risk", type: "Runtime exceeded P90", time: "22:05:10", affected: [], status: "open" },
  { id: "F-1031", job: "ING002", severity: "medium", code: "RC 0004", type: "Record count variance", time: "Yesterday 20:19", affected: [], status: "resolved" },
];

export const steps = [
  { step: "STEP010", program: "IEFBR14", rc: "0000", cpu: "0.01s", elapsed: "0.3s", status: "completed" as JobStatus },
  { step: "STEP020", program: "SORT", rc: "0000", cpu: "4.20s", elapsed: "48.1s", status: "completed" as JobStatus },
  { step: "STEP030", program: "TRNPOST", rc: "S0C7", cpu: "12.88s", elapsed: "2m 51s", status: "failed" as JobStatus },
  { step: "STEP040", program: "IDCAMS", rc: "—", cpu: "—", elapsed: "—", status: "waiting" as JobStatus },
];

export const sysout = `//NPTRN003 JOB (ACCT),'TRANSACTION POST',CLASS=A,MSGCLASS=X
//STEP030  EXEC PGM=TRNPOST
//TRNIN    DD DSN=NP.BATCH.TRN.SORTED,DISP=SHR
//JOBMSTR  DD DSN=NP.BATCH.JOBMASTER,DISP=SHR
//SYSOUT   DD SYSOUT=*
------------------------------------------------------------
IEF403I NPTRN003 - STARTED - TIME=21.47.30
TRNP001I PROCESSING INPUT FILE NP.BATCH.TRN.SORTED
TRNP014I 184,220 RECORDS READ
IDC3314I RECORD KEY 00048213-TX DUPLICATE IN NP.BATCH.JOBMASTER
TRNP099E VSAM WRITE FAILED  FILE STATUS 22
CEE3207S THE SYSTEM DETECTED A DATA EXCEPTION (SYSTEM CODE=0C7)
IEF450I NPTRN003 STEP030 - ABEND=S0C7 U0000 REASON=00000000
IEF404I NPTRN003 - ENDED - TIME=21.51.14`;

export const datasets = [
  { name: "NP.BATCH.JOBMASTER", type: "VSAM KSDS", size: "2.4 GB", records: "8,412,330", updated: "21:51:14", status: "warning" as JobStatus, usedBy: "TRN003, TRN004" },
  { name: "NP.BATCH.TRN.SORTED", type: "Sequential", size: "640 MB", records: "184,220", updated: "21:40:12", status: "completed" as JobStatus, usedBy: "TRN003" },
  { name: "NP.BATCH.ING.DAILY", type: "Sequential", size: "1.1 GB", records: "1,204,880", updated: "20:19:45", status: "completed" as JobStatus, usedBy: "ING002, ING003" },
  { name: "NP.BILL.RATES", type: "VSAM KSDS", size: "120 MB", records: "92,410", updated: "22:17:58", status: "running" as JobStatus, usedBy: "BIL002, BIL003" },
  { name: "NP.RPT.GL.MONTHLY", type: "GDG (+1)", size: "310 MB", records: "402,110", updated: "22:06:01", status: "running" as JobStatus, usedBy: "REP002" },
  { name: "NP.RISK.SCORES", type: "VSAM ESDS", size: "780 MB", records: "3,011,902", updated: "22:27:44", status: "completed" as JobStatus, usedBy: "RSK001, RSK002" },
];

export const users = [
  { name: "Asha Kulkarni", username: "HERC02", role: "Operator", status: "Active", last: "Now" },
  { name: "Daniel Reyes", username: "HERC01", role: "Administrator", status: "Active", last: "12m ago" },
  { name: "Mei Tanaka", username: "OPS07", role: "Operator", status: "Active", last: "1h ago" },
  { name: "Oliver Brandt", username: "OPS11", role: "Operator", status: "Suspended", last: "6d ago" },
];

export const audit = [
  { time: "22:08:31", user: "SYSTEM", action: "Mainframe sync completed", target: "MVS-TK5" },
  { time: "22:04:02", user: "HERC02", action: "Viewed AI analysis", target: "TRN003" },
  { time: "21:59:47", user: "HERC01", action: "Approved recovery plan draft", target: "RCV-218" },
  { time: "21:52:10", user: "SYSTEM", action: "Failure detected · S0C7", target: "TRN003" },
  { time: "21:30:00", user: "HERC01", action: "Updated alert threshold", target: "SLA · Billing" },
  { time: "20:00:00", user: "SYSTEM", action: "Batch window opened", target: "Nightly cycle" },
];

export const activity = [
  { time: "22:08", text: "BIL002 completed with RC 0000", status: "completed" as JobStatus },
  { time: "22:04", text: "REP002 exceeded expected runtime", status: "warning" as JobStatus },
  { time: "22:02", text: "BIL004 held — waiting on TRN005", status: "blocked" as JobStatus },
  { time: "21:58", text: "ING003 started", status: "running" as JobStatus },
  { time: "21:51", text: "TRN003 abended S0C7 (VSAM status 22)", status: "failed" as JobStatus },
];

export const notifications = [
  { title: "TRN003 failed", body: "S0C7 · VSAM duplicate key", status: "failed" as JobStatus },
  { title: "3 jobs blocked", body: "Downstream of TRN003", status: "blocked" as JobStatus },
  { title: "REP002 running long", body: "SLA risk in 14 minutes", status: "warning" as JobStatus },
];

export const aiAnalysis = {
  job: "TRN003",
  confidence: 92,
  rootCause: "Duplicate record key 00048213-TX was written to NP.BATCH.JOBMASTER. The VSAM write returned file status 22, the program did not handle the condition, and a later packed-decimal move on the uninitialised record caused S0C7.",
  evidence: [
    "IDC3314I duplicate key 00048213-TX in NP.BATCH.JOBMASTER",
    "TRNP099E VSAM WRITE FAILED FILE STATUS 22",
    "Same key appeared in TRN002 output (RC 0004 warning)",
    "Similar incident on 14 Sep resolved by de-duplication + restart",
  ],
  actions: [
    "Run DFSORT SUM FIELDS=NONE on NP.BATCH.TRN.SORTED to remove the duplicate",
    "Restart NPTRN003 from STEP030",
    "Release TRN004, TRN005 and BIL004 once TRN003 ends RC 0000",
    "Raise defect to add file-status 22 handling in TRNPOST",
  ],
};

export const recoveryPlans = [
  { id: "RCV-218", job: "TRN003", title: "De-duplicate input and restart from STEP030", state: "awaiting approval", steps: [
    { text: "Back up NP.BATCH.JOBMASTER (IDCAMS REPRO)", done: true },
    { text: "DFSORT de-duplicate NP.BATCH.TRN.SORTED", done: true },
    { text: "Restart NPTRN003 at STEP030", done: false },
    { text: "Release TRN004, TRN005, BIL004", done: false },
  ] },
  { id: "RCV-217", job: "ING002", title: "Re-run validation with corrected count", state: "completed", steps: [
    { text: "Correct control-total record", done: true }, { text: "Re-run NPING002", done: true },
  ] },
];

export const searchIndex = [
  ...jobs.map((x) => ({ label: x.id, hint: `Job · ${x.program}`, to: "/jobs/$jobId" as const, id: x.id })),
  ...streams.map((s) => ({ label: s.name, hint: "Batch stream", to: "/streams" as const, id: s.id })),
  { label: "VSAM Duplicate Key", hint: "Error type", to: "/failures" as const, id: "vsam" },
  ...datasets.map((d) => ({ label: d.name, hint: `Dataset · ${d.type}`, to: "/datasets" as const, id: d.name })),
];
