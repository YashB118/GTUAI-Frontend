"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  CheckCircle,
  Clock,
  BookOpen,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface Overview {
  total_students: number;
  total_admins: number;
  total_papers: number;
  total_materials: number;
  pending_approvals: number;
  approved_materials: number;
  rejected_materials: number;
  total_questions: number;
  total_subjects: number;
  total_patterns: number;
}

const EMPTY: Overview = {
  total_students: 0,
  total_admins: 0,
  total_papers: 0,
  total_materials: 0,
  pending_approvals: 0,
  approved_materials: 0,
  rejected_materials: 0,
  total_questions: 0,
  total_subjects: 0,
  total_patterns: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Overview>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get("/admin/analytics/overview");
        setStats(data || EMPTY);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Could not load stats");
      }
    })();
  }, []);

  const statCards = [
    { label: "Question Papers", value: stats.total_papers, icon: FileText, color: "text-accent" },
    { label: "Pending Approvals", value: stats.pending_approvals, icon: Clock, color: "text-amber-400" },
    { label: "Total Students", value: stats.total_students, icon: Users, color: "text-blue-400" },
    { label: "Approved Materials", value: stats.approved_materials, icon: BookOpen, color: "text-green-400" },
    { label: "Subjects", value: stats.total_subjects, icon: GraduationCap, color: "text-emerald-400" },
    { label: "Questions Extracted", value: stats.total_questions, icon: Sparkles, color: "text-violet-400" },
  ];

  const adminActions = [
    { href: "/admin/approvals", label: "Review pending materials", icon: CheckCircle, urgent: stats.pending_approvals > 0 },
    { href: "/admin/papers", label: "Manage question papers", icon: FileText, urgent: false },
    { href: "/admin/users", label: "View registered users", icon: Users, urgent: false },
    { href: "/admin/analytics", label: "View analytics dashboard", icon: LayoutDashboard, urgent: false },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <LayoutDashboard size={20} className="text-accent" />
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Admin Dashboard</h1>
      </div>

      {error && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2.5 text-xs text-amber-400">
          {error} — make sure Phase 4 SQL migrations have run.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs">{label}</CardTitle>
                <Icon size={14} className={color} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-text-primary">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-3">
          Quick Actions
        </h2>
        <div className="space-y-2">
          {adminActions.map(({ href, label, icon: Icon, urgent }) => (
            <a
              key={href}
              href={href}
              className="flex items-center justify-between bg-bg-card border border-border rounded-lg px-4 py-3.5 hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-text-muted group-hover:text-accent transition-colors" />
                <span className="text-sm text-text-primary">{label}</span>
              </div>
              {urgent && (
                <Badge variant="warning">{stats.pending_approvals} pending</Badge>
              )}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-lg px-4 py-3.5">
        <p className="text-sm text-text-secondary">
          <span className="text-accent font-medium">Phase 4 active</span> — full admin
          panel: PDF preview approvals, paper management, user management with CSV
          export, prediction weight tuning, live analytics charts.
        </p>
      </div>
    </div>
  );
}
