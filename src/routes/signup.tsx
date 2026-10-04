import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { AuthLayout, Field, inputCls, btnPrimary } from "@/components/auth-layout";
import { PasswordInput } from "@/components/password-input";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Mainframe Control Tower" },
      { name: "description", content: "Create a Mainframe Control Tower account as an operator or administrator." },
      { property: "og:title", content: "Create Account — Mainframe Control Tower" },
      { property: "og:description", content: "Get started with AI-powered batch workload monitoring." },
    ],
  }),
  component: SignUp,
});

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    username: z.string().trim().regex(/^[a-zA-Z0-9_.-]{3,30}$/, "3–30 letters, numbers, . _ -"),
    password: z.string().min(8, "At least 8 characters").max(128),
    confirm: z.string(),
    role: z.enum(["operator", "administrator"]),
    terms: z.literal("on", { errorMap: () => ({ message: "Please accept the terms" }) }),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });

function SignUp() {
  const nav = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!r.success) {
      const out: Record<string, string> = {};
      r.error.issues.forEach((i) => (out[String(i.path[0])] ??= i.message));
      setErrors(out);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => nav({ to: "/dashboard" }), 900);
  };

  const text = (id: string, label: string, type = "text", ac?: string) => (
    <Field id={id} label={label} error={errors[id]}>
      <input id={id} name={id} type={type} autoComplete={ac} className={inputCls} aria-invalid={!!errors[id]} />
    </Field>
  );

  return (
    <AuthLayout>
      <h1 className="font-display text-4xl">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Start understanding your batch workloads.</p>
      <form onSubmit={submit} noValidate className="mt-8 space-y-4">
        {text("name", "Full name", "text", "name")}
        {text("email", "Email", "email", "email")}
        {text("username", "Username", "text", "username")}
        <Field id="password" label="Password" error={errors.password}>
          <PasswordInput id="password" name="password" autoComplete="new-password" aria-invalid={!!errors.password} />
        </Field>
        <Field id="confirm" label="Confirm password" error={errors.confirm}>
          <PasswordInput id="confirm" name="confirm" autoComplete="new-password" aria-invalid={!!errors.confirm} />
        </Field>
        <fieldset className="space-y-1.5">
          <legend className="text-sm font-medium">Role</legend>
          <div className="grid grid-cols-2 gap-2">
            {["operator", "administrator"].map((r) => (
              <label key={r} className="flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm capitalize has-[:checked]:border-primary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/30">
                <input type="radio" name="role" value={r} defaultChecked={r === "operator"} className="accent-primary" /> {r}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input type="checkbox" name="terms" className="mt-0.5 accent-primary" /> I agree to the terms of use and privacy notice.
          </label>
          {errors.terms && <p className="mt-1 text-xs text-destructive" role="alert">{errors.terms}</p>}
        </div>
        <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
          {loading && <Loader2 size={16} className="animate-spin" />} {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
      <p className="mt-8 text-sm text-muted-foreground">
        Already have an account? <Link to="/signin" className="font-medium text-foreground hover:underline">Sign In</Link>
      </p>
    </AuthLayout>
  );
}
