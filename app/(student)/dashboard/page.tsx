"use client";

import { useEffect, useState } from "react";
import { Sparkles, BookOpen, FileQuestion, Upload, MessageSquare, ArrowRight, Star, PenLine, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import Link from "next/link";
import { useCountUp } from "@/hooks/useCountUp";
import { toast } from "sonner";

interface UserProfile {
  full_name: string;
  branch: string;
  semester: number;
  enrollment_no: string;
}

interface Stats {
  papersUploaded: number;
  papersProcessed: number;
  predictionsSubjects: number;
  materialsIndexed: number;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const quickLinks = [
  {
    href: "/predict",
    icon: Sparkles,
    title: "Predict Exam",
    desc: "AI predictions from past question papers",
    color: "text-violet-400",
    bg: "bg-violet-500/8 border-violet-500/15",
  },
  {
    href: "/chat",
    icon: MessageSquare,
    title: "GTU GPT",
    desc: "AI chat assistant for exam questions",
    color: "text-accent",
    bg: "bg-accent/8 border-accent/15",
  },
  {
    href: "/materials",
    icon: BookOpen,
    title: "Study Materials",
    desc: "Notes, textbooks, handwritten materials",
    color: "text-blue-400",
    bg: "bg-blue-500/8 border-blue-500/15",
  },
  {
    href: "/question-bank",
    icon: FileQuestion,
    title: "Question Bank",
    desc: "Browse previous year question papers",
    color: "text-emerald-400",
    bg: "bg-emerald-500/8 border-emerald-500/15",
  },
  {
    href: "/my-uploads",
    icon: Upload,
    title: "My Uploads",
    desc: "Papers and materials you have uploaded",
    color: "text-amber-400",
    bg: "bg-amber-500/8 border-amber-500/15",
  },
];

function AnimatedStat({ value, label, sub }: { value: number; label: string; sub: string }) {
  const count = useCountUp(value, 900);
  return (
    <Card>
      <CardTitle>{label}</CardTitle>
      <CardContent className="mt-3">
        <p className="text-[28px] font-semibold tracking-[-0.04em] text-text-primary leading-none tabular-nums">
          {count}
        </p>
        <p className="text-[12px] text-text-muted mt-1.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats>({ papersUploaded: 0, papersProcessed: 0, predictionsSubjects: 0, materialsIndexed: 0 });
  const [showReview, setShowReview] = useState(false);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewQuote, setReviewQuote] = useState("");
  const [reviewCollege, setReviewCollege] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("users")
        .select("full_name, branch, semester, enrollment_no")
        .eq("id", user.id)
        .maybeSingle();
      if (profileData) setProfile(profileData);

      const [myPapers, allMaterials] = await Promise.all([
        api.get(`/papers/?uploaded_by=${user.id}`).catch(() => []),
        api.get("/materials/?approved_only=true").catch(() => []),
      ]);

      const papers = Array.isArray(myPapers) ? myPapers : [];
      const materials = Array.isArray(allMaterials) ? allMaterials : [];
      const processed = papers.filter((p: { processing_status: string }) => p.processing_status === "done").length;
      const uniqueSubjects = new Set(
        papers
          .filter((p: { processing_status: string }) => p.processing_status === "done")
          .map((p: { subject_id: string }) => p.subject_id)
      ).size;

      setStats({
        papersUploaded: papers.length,
        papersProcessed: processed,
        predictionsSubjects: uniqueSubjects,
        materialsIndexed: materials.length,
      });
    }
    load();
  }, []);

  const firstName = profile?.full_name?.split(" ")[0] || "Student";

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewQuote.trim().length < 20) { setReviewError("Write at least 20 characters."); return; }
    setReviewSubmitting(true);
    setReviewError("");
    try {
      await api.post("/testimonials", { quote: reviewQuote.trim(), stars: reviewStars, college: reviewCollege.trim() });
      setReviewSent(true);
      toast.success("Review submitted! It'll appear on the landing page.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit review";
      setReviewError(msg);
      toast.error(msg);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">

      {/* Hero */}
      <div className="pt-2">
        <div className="flex items-center gap-4 mb-6">
          {profile && <UserAvatar name={profile.full_name} size="lg" />}
          <div>
            <p className="text-[13px] text-text-muted mb-0.5">{getGreeting()}</p>
            <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-text-primary leading-none">
              {firstName}
            </h1>
            {profile && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <Badge variant="accent">{profile.branch}</Badge>
                <Badge variant="default">Semester {profile.semester}</Badge>
                {profile.enrollment_no && (
                  <span className="text-[11px] text-text-muted font-mono">{profile.enrollment_no}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {stats.papersUploaded === 0 ? (
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/8 border border-accent/20 text-[13px] text-accent">
            <Upload size={13} className="shrink-0" />
            Upload your first question paper to unlock AI predictions.
          </div>
        ) : stats.predictionsSubjects === 0 ? (
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/8 border border-amber-500/20 text-[13px] text-amber-400">
            <TrendingUp size={13} className="shrink-0" />
            Upload 1 more paper per subject to generate predictions.
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-[13px] text-emerald-400">
            <Sparkles size={13} className="shrink-0" />
            {stats.predictionsSubjects} subject{stats.predictionsSubjects !== 1 ? "s" : ""} ready — select one in Predict to see questions.
          </div>
        )}
      </div>

      {/* Stats */}
      <div>
        <p className="label-caps mb-3">Overview</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AnimatedStat value={stats.papersUploaded} label="Papers Uploaded" sub={`${stats.papersProcessed} processed by AI`} />
          <AnimatedStat value={stats.predictionsSubjects} label="Predictions Ready" sub="subjects analyzed" />
          <AnimatedStat value={stats.materialsIndexed} label="Study Materials" sub="approved materials" />
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <p className="label-caps mb-3">Features</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map(({ href, icon: Icon, title, desc, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-4 rounded-xl p-5 transition-all duration-300 card-depth hover:card-depth-hover hover:-translate-y-px group"
            >
              <div className={`w-9 h-9 rounded-xl ${bg} border flex items-center justify-center shrink-0`}>
                <Icon size={16} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-medium text-text-primary">{title}</span>
                <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">{desc}</p>
              </div>
              <ArrowRight size={13} className="text-text-muted group-hover:text-accent transition-colors shrink-0 mt-0.5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Share Experience */}
      <div>
        <p className="label-caps mb-3">Community</p>
        <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
          {reviewSent ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="text-emerald-400" size={24} />
              </div>
              <p className="text-sm font-semibold text-text-primary">Review submitted!</p>
              <p className="text-xs text-text-muted">Thanks — your review will appear on the landing page.</p>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowReview(v => !v)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-bg-elevated transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/8 border border-accent/15 flex items-center justify-center shrink-0">
                  <PenLine size={15} className="text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-text-primary">Share your experience</p>
                  <p className="text-[12px] text-text-secondary">Your review shows up on the GTU ExamAI landing page</p>
                </div>
                <ArrowRight size={13} className={`text-text-muted transition-transform ${showReview ? "rotate-90" : ""}`} />
              </button>

              {showReview && (
                <form onSubmit={handleReviewSubmit} className="px-5 pb-5 space-y-4 border-t border-border/60">
                  <div className="pt-4">
                    <label className="text-xs text-text-muted block mb-2">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewStars(n)}
                          className="p-0.5 transition-transform hover:scale-110"
                        >
                          <Star
                            size={22}
                            className={n <= reviewStars ? "text-amber-400 fill-amber-400" : "text-text-muted"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">Your review *</label>
                    <textarea
                      rows={4}
                      placeholder="Tell other students how GTU ExamAI helped you..."
                      value={reviewQuote}
                      onChange={e => setReviewQuote(e.target.value)}
                      className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/60 resize-none transition-colors"
                      required
                    />
                    <p className="text-[11px] text-text-muted mt-1">{reviewQuote.length} chars (min 20)</p>
                  </div>

                  <div>
                    <label className="text-xs text-text-muted block mb-1.5">College / Institute (optional)</label>
                    <input
                      type="text"
                      placeholder="LDRP Institute of Technology"
                      value={reviewCollege}
                      onChange={e => setReviewCollege(e.target.value)}
                      className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/60 transition-colors"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-xs text-red-400 bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2">{reviewError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {reviewSubmitting ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <PenLine size={13} />
                    )}
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
}
