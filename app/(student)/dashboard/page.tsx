"use client";

import { useEffect, useState } from "react";
import { Sparkles, BookOpen, FileQuestion, Upload, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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

        <p className="text-[13px] text-text-secondary flex items-center gap-2">
          <Sparkles size={12} className="text-accent shrink-0" />
          AI predictions ready — upload more papers to improve accuracy.
        </p>
      </div>

      {/* Stats */}
      <div>
        <p className="label-caps mb-3">Overview</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card>
            <CardTitle>Papers Uploaded</CardTitle>
            <CardContent className="mt-3">
              <p className="text-[28px] font-semibold tracking-[-0.04em] text-text-primary leading-none">{stats.papersUploaded}</p>
              <p className="text-[12px] text-text-muted mt-1.5">{stats.papersProcessed} processed by AI</p>
            </CardContent>
          </Card>

          <Card>
            <CardTitle>Predictions Ready</CardTitle>
            <CardContent className="mt-3">
              <p className="text-[28px] font-semibold tracking-[-0.04em] text-text-primary leading-none">{stats.predictionsSubjects}</p>
              <p className="text-[12px] text-text-muted mt-1.5">subjects analyzed</p>
            </CardContent>
          </Card>

          <Card>
            <CardTitle>Study Materials</CardTitle>
            <CardContent className="mt-3">
              <p className="text-[28px] font-semibold tracking-[-0.04em] text-text-primary leading-none">{stats.materialsIndexed}</p>
              <p className="text-[12px] text-text-muted mt-1.5">approved materials</p>
            </CardContent>
          </Card>
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

    </div>
  );
}
