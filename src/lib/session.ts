// Demo-only session kept in the browser. NOT real authentication.
export type Role = "operator" | "administrator";
export type Session = { name: string; username: string; role: Role };
const KEY = "mct-demo-session";

export function saveSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
export function clearSession() {
  localStorage.removeItem(KEY);
}
