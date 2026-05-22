import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Sparkles, BookOpen, MessageSquare, ArrowRight, Brain, TrendingUp,
  FileText, Zap, BarChart3, GraduationCap, Mail, MapPin, Clock, Star,
  ChevronRight, PenLine,
} from "lucide-react";
import ContactForm from "@/components/landing/ContactForm";

interface TestimonialData {
  id: string;
  name: string;
  branch: string | null;
  semester: number | null;
  college: string | null;
  quote: string;
  stars: number;
}

const AVATAR_COLORS = [
  "bg-accent/20 text-accent",
  "bg-emerald-500/20 text-emerald-400",
  "bg-amber-500/20 text-amber-400",
  "bg-blue-500/20 text-blue-400",
  "bg-violet-500/20 text-violet-400",
  "bg-pink-500/20 text-pink-400",
];

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "?";
}

const FEATURES = [
  {
    icon: TrendingUp,
    title: "AI Exam Predictions",
    desc: "Weighted scoring across frequency, recency, marks and unit distribution — questions ranked by probability of appearing.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: FileText,
    title: "5-Year Question Bank",
    desc: "Every GTU question paper from the past 5 years, parsed and indexed. Search by subject, unit, marks, or question type.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: BookOpen,
    title: "Study Materials Hub",
    desc: "Student-uploaded notes, textbooks, and slides — peer-reviewed and organized by subject and semester.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: Zap,
    title: "Instant AI Answers",
    desc: "Ask any GTU question and get a marks-aware, structured answer grounded in your study materials via RAG.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: MessageSquare,
    title: "GTU Chat Assistant",
    desc: "Chat with an AI that knows GTU syllabus. Ask for explanations, summaries, and exam tips — subject-aware context.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "See which units are asked most often, which question types dominate, and spot gaps in your preparation instantly.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Upload or Browse Papers",
    desc: "Upload GTU question papers yourself or browse our growing verified library across all branches and semesters.",
  },
  {
    step: "02",
    title: "AI Analyzes Patterns",
    desc: "Our model detects question patterns, frequency trends, unit weightage, and mark distributions across 5 years.",
  },
  {
    step: "03",
    title: "Get Ranked Predictions",
    desc: "Receive a prioritized list of high-probability questions with confidence scores. Study smarter, not harder.",
  },
];


const STATS = [
  { value: "5+", label: "Years of GTU Papers" },
  { value: "50+", label: "Subjects Covered" },
  { value: "AI", label: "Powered Predictions" },
  { value: "Free", label: "For Students" },
];

export default async function RootPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const role = session.user.user_metadata?.role || "student";
    redirect(role === "admin" ? "/admin/dashboard" : "/dashboard");
  }

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  let testimonials: TestimonialData[] = [];
  try {
    const res = await fetch(`${BACKEND}/testimonials`, { next: { revalidate: 300 } });
    if (res.ok) testimonials = await res.json();
  } catch {}

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">

      {/* ─── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 font-bold text-[15px] tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
            <Brain className="text-accent" size={16} />
          </div>
          <span>GTU ExamAI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-text-primary transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-text-primary transition-colors">Reviews</a>
          <a href="#contact" className="hover:text-text-primary transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block">
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accent-hover transition-colors shadow-accent"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ─── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-28 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "900px",
            height: "700px",
            background: "radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.20) 0%, rgba(108,99,255,0.05) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-40 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "600px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.4), transparent)",
          }}
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-xs font-semibold mb-8 shadow-[0_0_20px_rgba(108,99,255,0.12)]">
            <Sparkles size={11} />
            AI-powered exam predictions for GTU students
            <ChevronRight size={11} className="text-accent/60" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-[-0.04em] mb-6 leading-[1.05]">
            Stop Guessing.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #A78BFA 50%, #818CF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Start Predicting.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
            GTU&apos;s first AI platform that analyzes 5 years of past papers to predict which
            questions are most likely to appear in your next exam — with ranked confidence scores.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-all shadow-[0_0_30px_rgba(108,99,255,0.25)] hover:shadow-[0_0_40px_rgba(108,99,255,0.35)] text-[15px]"
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-border text-text-primary font-semibold hover:bg-bg-card hover:border-accent/30 transition-all text-[15px]"
            >
              See How It Works
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(({ value, label }) => (
              <div key={label} className="rounded-xl border border-border/60 bg-bg-card/50 px-4 py-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-text-primary tracking-tight">{value}</p>
                <p className="text-xs text-text-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need to ace GTU exams
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Built specifically for GTU&apos;s BE and Diploma syllabi. No generic tools, no fluff.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-bg-card p-6 hover:border-accent/30 transition-all hover:shadow-[0_4px_24px_rgba(108,99,255,0.08)]"
              >
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={color} size={19} />
                </div>
                <h3 className="font-semibold text-text-primary mb-2 text-[15px]">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(108,99,255,0.05) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              From paper to prediction in minutes
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-lg mb-6 relative z-10 shadow-[0_0_20px_rgba(108,99,255,0.12)]">
                  {step}
                </div>
                <h3 className="font-semibold text-[15px] mb-2 text-text-primary">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ───────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Student Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Trusted by GTU students
            </h2>
            <p className="text-text-secondary">Real feedback from students who used GTU ExamAI in their exams.</p>
          </div>

          {testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <PenLine className="text-accent" size={22} />
              </div>
              <div>
                <p className="text-text-primary font-semibold mb-1">No reviews yet</p>
                <p className="text-sm text-text-secondary">Be the first GTU student to share your experience.</p>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
              >
                Sign up and write a review
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => {
                const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                const roleLabel = [t.branch, t.semester ? `Sem ${t.semester}` : null].filter(Boolean).join(" · ");
                return (
                  <div
                    key={t.id}
                    className="rounded-2xl border border-border bg-bg-card p-6 flex flex-col gap-4 hover:border-accent/20 transition-all"
                  >
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
                        {getInitials(t.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{t.name}</p>
                        {roleLabel && <p className="text-xs text-text-muted truncate">{roleLabel}</p>}
                        {t.college && <p className="text-[10px] text-text-muted/70 truncate">{t.college}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── Contact ────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(108,99,255,0.06) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Contact Us</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Get in touch
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Have a question, suggestion, or want to partner with us? We read every message.
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-10">
            {/* Contact info */}
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-2xl border border-border bg-bg-card p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary mb-0.5">Email</p>
                    <a href="mailto:yashbonde21@gmail.com" className="text-sm text-text-secondary hover:text-accent transition-colors">
                      yashbonde21@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary mb-0.5">Built for</p>
                    <p className="text-sm text-text-secondary">Gujarat Technological University<br />BE &amp; Diploma students</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary mb-0.5">Response time</p>
                    <p className="text-sm text-text-secondary">Within 24 hours</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                <p className="text-sm font-semibold text-accent mb-1">Report a bug or request a feature</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Found something wrong or want a new feature? Tell us — we ship fixes fast.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="md:col-span-3 rounded-2xl border border-border bg-bg-card p-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-3xl border border-accent/20 p-12 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(108,99,255,0.03) 100%)" }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 60%)" }}
            />
            <div className="relative">
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center shadow-[0_0_30px_rgba(108,99,255,0.2)]">
                  <GraduationCap className="text-accent" size={26} />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Join GTU students studying smarter
              </h2>
              <p className="text-text-secondary mb-8 text-[15px]">
                Free for students. No credit card. Start predicting your exam questions today.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover transition-all shadow-[0_0_30px_rgba(108,99,255,0.3)] hover:shadow-[0_0_40px_rgba(108,99,255,0.4)] text-base"
              >
                Sign Up Free
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-[15px] tracking-tight">
            <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
              <Brain className="text-accent" size={14} />
            </div>
            GTU ExamAI
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-text-muted">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-text-primary transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-text-primary transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-text-primary transition-colors">Contact</a>
            <Link href="/login" className="hover:text-text-primary transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-text-primary transition-colors">Register</Link>
          </nav>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} GTU ExamAI · Built for GTU students
          </p>
        </div>
      </footer>

    </div>
  );
}
