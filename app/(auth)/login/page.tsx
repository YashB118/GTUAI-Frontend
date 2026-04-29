"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        localStorage.setItem("access_token", data.session.access_token);
        const role = data.user?.user_metadata?.role || "student";
        router.push(role === "admin" ? "/admin/dashboard" : "/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-[360px] animate-blur-in">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-accent/10 mb-5" style={{ boxShadow: "0 0 0 1px rgba(108,99,255,0.2), 0 4px 16px rgba(108,99,255,0.1)" }}>
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-text-primary">
            GTU ExamAI
          </h1>
          <p className="text-[13px] text-text-secondary mt-1">
            Smart predictions for smarter prep
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7 space-y-6 bg-bg-card border border-border" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.3), 0 0 0 1px rgb(var(--c-border)/0.6)" }}>
          <div>
            <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-text-primary">Welcome back</h2>
            <p className="text-[13px] text-text-secondary mt-0.5">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <p className="text-[12px] text-red-400 bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2.5">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-1" loading={loading} size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-[13px] text-text-secondary">
            No account?{" "}
            <Link href="/register" className="text-accent hover:text-accent-hover transition-colors font-medium">
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
