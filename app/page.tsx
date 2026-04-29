import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Sparkles, BookOpen, MessageSquare, ArrowRight, Brain, TrendingUp, Users } from "lucide-react";

export default async function RootPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const role = session.user.user_metadata?.role || "student";
    redirect(role === "admin" ? "/admin/dashboard" : "/dashboard");
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border/50 bg-bg-primary/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Brain className="text-accent" size={22} />
          GTU ExamAI
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-medium mb-8">
            <Sparkles size={12} />
            AI-powered exam predictions for GTU
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Stop Guessing.
            <br />
            <span className="text-accent">Start Predicting.</span>
          </h1>
          <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto">
            GTU&apos;s first AI platform that analyzes 5 years of past papers to predict which questions are most likely to appear in your next exam.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border text-text-primary font-semibold hover:bg-bg-card transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Everything you need to ace GTU exams</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "AI Predictions",
                desc: "Weighted scoring across frequency, recency, marks and unit distribution — ranked by probability.",
              },
              {
                icon: BookOpen,
                title: "Study Materials Hub",
                desc: "Student-uploaded notes, textbooks, and slides — all peer-reviewed and organized by subject.",
              },
              {
                icon: MessageSquare,
                title: "Instant Answers",
                desc: "Ask any GTU question and get a structured, marks-aware answer generated from your subject materials.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-border bg-bg-card p-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="text-accent" size={20} />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-bg-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Past Papers", desc: "Upload GTU question papers or browse our growing library of verified papers." },
              { step: "02", title: "AI Analyzes Patterns", desc: "Our model detects question patterns, frequency, and unit weightage across years." },
              { step: "03", title: "Get Predictions", desc: "Receive a ranked list of high-probability questions with confidence scores." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold text-sm mb-4">
                  {step}
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-center mb-4">
            <Users className="text-accent" size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join GTU students studying smarter</h2>
          <p className="text-text-secondary mb-8">Free forever for students. No credit card needed.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors text-base"
          >
            Sign Up Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-6 px-6 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} GTU ExamAI. Built for GTU students.
      </footer>
    </div>
  );
}
