"use client";

import { useEffect, useState } from "react";
import { Sparkles, BookOpen, FileQuestion, Upload, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import Link from "next/link";

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
    desc: "AI predictions based on past question papers",
    badge: null,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    href: "/materials",
    icon: BookOpen,
    title: "Study Materials",
    desc: "Notes, textbooks, handwritten materials",
    badge: null,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    href: "/question-bank",
    icon: FileQuestion,
    title: "Question Bank",
    desc: "Browse previous year question papers",
    badge: null,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    href: "/my-uploads",
    icon: Upload,
    title: "My Uploads",
    desc: "Papers and materials you have uploaded",
    badge: null,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

export default function StudentDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats>({ papersUploaded: 0, papersProcessed: 0, predictionsSubjects: 0, materialsIndexed: 0 });

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

      // Load stats via backend API (bypasses RLS token issues)
      const [myPapers, allMaterials] = await Promise.all([
        api.get(`/papers/?uploaded_by=${user.id}`).catch(() => []),
        api.get("/materials/?approved_only=true").catch(() => []),
      ]);

      const papers = Array.isArray(myPapers) ? myPapers : [];
      const materials = Array.isArray(allMaterials) ? allMaterials : [];

      const uploaded = papers.length;
      const processed = papers.filter((p: { processing_status: string }) => p.processing_status === "done").length;
      const uniqueSubjects = new Set(
        papers
          .filter((p: { processing_status: string }) => p.processing_status === "done")
          .map((p: { subject_id: string }) => p.subject_id)
      ).size;

      setStats({
        papersUploaded: uploaded,
        papersProcessed: processed,
        predictionsSubjects: uniqueSubjects,
        materialsIndexed: materials.length,
      });
    }
    load();
  }, []);

  const firstName = profile?.full_name?.split(" ")[0] || "Student";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <div
        className="rounded-xl p-6 border border-border"
        style={{ background: "linear-gradient(135deg, #6C63FF10, #0A0A0F)" }}
      >
        <div className="flex items-start gap-4">
          {profile && (
            <UserAvatar name={profile.full_name} size="lg" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-text-secondary text-sm">{getGreeting()},</p>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary mt-0.5">
              {profile?.full_name || "Student"}
            </h1>
            {profile && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="accent">{profile.branch}</Badge>
                <Badge variant="default">Semester {profile.semester}</Badge>
                {profile.enrollment_no && (
                  <span className="text-xs text-text-muted font-mono">{profile.enrollment_no}</span>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="text-text-secondary text-sm mt-4 flex items-center gap-1.5">
          <TrendingUp size={14} className="text-accent" />
          AI exam predictions are ready. Upload papers to improve accuracy.
        </p>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-3">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Papers Uploaded</CardTitle>
                <Upload size={16} className="text-text-muted" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-text-primary">{stats.papersUploaded}</p>
              <p className="text-xs text-text-muted mt-1">{stats.papersProcessed} processed by AI</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Predictions Ready</CardTitle>
                <Sparkles size={16} className="text-text-muted" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-text-primary">{stats.predictionsSubjects}</p>
              <p className="text-xs text-text-muted mt-1">subjects with predictions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Study Materials</CardTitle>
                <BookOpen size={16} className="text-text-muted" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-text-primary">{stats.materialsIndexed}</p>
              <p className="text-xs text-text-muted mt-1">approved materials</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-3">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map(({ href, icon: Icon, title, desc, badge, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-4 bg-bg-card border border-border rounded-xl p-5 hover:border-accent/30 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} border flex items-center justify-center shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{title}</span>
                  {badge && <Badge variant="default">{badge}</Badge>}
                </div>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{desc}</p>
              </div>
              <ArrowRight size={14} className="text-text-muted group-hover:text-accent transition-colors shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
