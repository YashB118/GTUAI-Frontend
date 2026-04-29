"use client";

import { useState, useEffect } from "react";
import { BarChart3, RefreshCw, FileText, BookOpen, Users, GraduationCap } from "lucide-react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { api } from "@/lib/api";

interface Paper {
  id: string;
  processing_status: string;
  exam_type: string;
  subjects?: { name: string; code: string };
}

interface Material {
  id: string;
  approval_status: string;
  processing_status: string | null;
  material_type: string;
}

interface Subject {
  id: string;
  name: string;
  code: string | null;
  branch: string | null;
}

interface User {
  id: string;
  role: string;
  branch: string | null;
}

function groupCount<T>(items: T[], key: (item: T) => string): [string, number][] {
  const map: Record<string, number> = {};
  for (const item of items) {
    const k = key(item) || "unknown";
    map[k] = (map[k] || 0) + 1;
  }
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

export default function AnalyticsPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [p, m, s, u] = await Promise.all([
      api.get("/papers/").catch(() => []),
      api.get("/materials/?approved_only=false").catch(() => []),
      api.get("/subjects").catch(() => []),
      api.get("/auth/users").catch(() => []),
    ]);
    setPapers(Array.isArray(p) ? p : []);
    setMaterials(Array.isArray(m) ? m : []);
    setSubjects(Array.isArray(s) ? s : []);
    setUsers(Array.isArray(u) ? u : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const papersByStatus = groupCount(papers, p => p.processing_status);
  const papersByExamType = groupCount(papers, p => p.exam_type);
  const papersBySubject = groupCount(papers, p => p.subjects?.name || "Unknown");
  const materialsByStatus = groupCount(materials, m => m.approval_status);
  const materialsByType = groupCount(materials, m => m.material_type);
  const usersByBranch = groupCount(users, u => u.branch || "Unknown");

  const statCards = [
    { label: "Question Papers", value: papers.length, icon: FileText, color: "text-accent" },
    { label: "Study Materials", value: materials.length, icon: BookOpen, color: "text-blue-400" },
    { label: "Subjects", value: subjects.length, icon: GraduationCap, color: "text-emerald-400" },
    { label: "Users", value: users.length, icon: Users, color: "text-violet-400" },
  ];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 size={20} className="text-accent" />
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Analytics</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 size={20} className="text-accent" />
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Analytics</h1>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-bg-card border border-border rounded-xl px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-text-muted">{label}</p>
              <Icon size={14} className={color} />
            </div>
            <p className="text-2xl font-semibold text-text-primary">{value}</p>
          </div>
        ))}
      </div>

      {/* Breakdown grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <BreakdownCard title="Papers by Status" rows={papersByStatus} total={papers.length} />
        <BreakdownCard title="Papers by Exam Type" rows={papersByExamType} total={papers.length} />
        <BreakdownCard title="Top Subjects (papers)" rows={papersBySubject.slice(0, 6)} total={papers.length} />
        <BreakdownCard title="Materials by Status" rows={materialsByStatus} total={materials.length} />
        <BreakdownCard title="Materials by Type" rows={materialsByType} total={materials.length} />
        <BreakdownCard title="Users by Branch" rows={usersByBranch.slice(0, 6)} total={users.length} />
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  rows,
  total,
}: {
  title: string;
  rows: [string, number][];
  total: number;
}) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-xs text-text-muted">No data</p>
      ) : (
        <div className="space-y-2">
          {rows.map(([label, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-secondary capitalize">{label}</span>
                  <span className="text-xs font-medium text-text-primary">{count}</span>
                </div>
                <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent/60 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
