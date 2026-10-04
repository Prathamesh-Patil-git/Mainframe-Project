import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { AuthLayout, Field, inputCls, btnPrimary } from "@/components/auth-layout";
import { PasswordInput } from "@/components/password-input";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — Mainframe Control Tower" },
      { name: "description", content: "Sign in to Mainframe Control Tower to monitor batch workloads and recover with confidence." },
      { property: "og:title", content: "Sign In — Mainframe Control Tower" },
      { property: "og:description", content: "Access your mainframe batch operations control tower." },
    ],
  }),
  component: SignIn,
});

const schema = z.object({
  identity: z.string().trim().min(3, "Enter your email or username").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

function SignIn() {
  const nav = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = schema.safeParse({ identity: f.get("identity"), password: f.get("password") });
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => nav({ to: "/dashboard" }), 900);
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to your control tower.</p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <Field id="identity" label="Email or username" error={errors.identity}>
          <input id="identity" name="identity" autoComplete="username" className={inputCls} aria-invalid={!!errors.identity} />
        </Field>
        <Field id="password" label="Password" error={errors.password}>
          <PasswordInput id="password" name="password" autoComplete="current-password" aria-invalid={!!errors.password} />
        </Field>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="remember" className="accent-primary" /> Remember me</label>
          <a href="#" className="text-accent hover:underline">Forgot password?</a>
        </div>
        <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
          {loading && <Loader2 size={16} className="animate-spin" />} {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
      <p className="mt-8 text-sm text-muted-foreground">
        Don't have an account? <Link to="/signup" className="font-medium text-foreground hover:underline">Create account</Link>
      </p>
    </AuthLayout>
  );
}
