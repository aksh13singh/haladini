"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-wine">{label}</span>
      {children}
    </label>
  );
}

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-flamingo-tint bg-white py-2.5 text-sm font-semibold text-wine transition-colors hover:bg-flamingo-tint/40"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
      </svg>
      Continue with Google
    </button>
  );
}

export function AuthPanel() {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setError("");
    setInfo("");
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.refresh();
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    if (!name.trim()) return setError("Please enter your name.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback?next=/account`
            : undefined,
      },
    });
    setLoading(false);
    if (error) return setError(error.message);

    // Welcome email (best-effort — never blocks signup).
    if (data.user?.id) {
      fetch("/api/notify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: data.user.id }),
        keepalive: true,
      }).catch(() => {});
    }

    if (data.session) router.refresh();
    else
      setInfo(
        "Almost there! Check your email to confirm your account, then sign in."
      );
  };

  const google = async () => {
    reset();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
  };

  if (info) {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-flamingo-tint bg-white p-8 text-center shadow-card">
          <CheckCircle2 className="mx-auto h-12 w-12 text-flamingo-deep" />
          <h2 className="mt-4 font-display text-2xl font-semibold text-wine">
            Confirm your email
          </h2>
          <p className="mt-2 text-sm text-ink/65">{info}</p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setInfo("");
              setTab("signin");
            }}
          >
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center">
        <h1 className="display-heading text-3xl sm:text-4xl">My Account</h1>
        <p className="mt-2 text-ink/60">
          Sign in or create your Haladini account.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-flamingo-tint bg-white p-6 shadow-card sm:p-8">
        <div className="grid grid-cols-2 gap-1 rounded-full bg-flamingo-tint/50 p-1">
          {(["signin", "signup"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                reset();
              }}
              className={cn(
                "rounded-full py-2 text-sm font-semibold transition-colors",
                tab === t ? "bg-white text-wine shadow-sm" : "text-wine/60"
              )}
            >
              {t === "signin" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <form
          onSubmit={tab === "signin" ? signIn : signUp}
          className="mt-6 space-y-4"
        >
          {tab === "signup" && (
            <Field label="Full name">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </Field>
          )}
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tab === "signup" ? "At least 6 characters" : "••••••••"}
              autoComplete={tab === "signin" ? "current-password" : "new-password"}
              required
            />
          </Field>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading
              ? "Please wait…"
              : tab === "signin"
                ? "Sign In"
                : "Create Account"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-ink/40">
          <span className="h-px flex-1 bg-flamingo-tint" />
          or
          <span className="h-px flex-1 bg-flamingo-tint" />
        </div>

        <GoogleButton onClick={google} />
      </div>
    </div>
  );
}
