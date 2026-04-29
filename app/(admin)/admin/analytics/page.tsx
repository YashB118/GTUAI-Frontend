"use client";

import { useState, useEffect } from "react";
import {
  BarChart3, RefreshCw, FileText, BookOpen, Users, GraduationCap, Sparkles, Clock,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
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

interface UploadPoint {
  date: string;
  papers: number;
  materials: number;
}

interface TopSubject {
  id: string;
  name: string;
  code: string | null;
  paper_count: number;
}

interface TopMaterial {
  id: string;
  title: string;
  material_type: string;
  chunk_count: number | null;
  file_size_kb: number;
  subjects?: { name: string };
}

interface Signup {
  id: string;
  full_name: string;
  email: string;
  branch: string | null;
  semester: number | null;
  enrollment_no: string | null;
  created_at: string;
}

const EMPTY: Overview = {
  total_students: 0, total_admins: 0, total_papers: 0, total_materials: 0,
  pending_approvals: 0, approved_materials: 0, rejected_materials: 0,
  total_questions: 0, total_subjects: 0, total_patterns: 0,
};

const ACCENT = "#6C63FF";
const BLUE = "#5B8DEF";
const GRID = "#2A2A35";
const TICK = "#8888A0";

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<Overview>(EMPTY);
  const [uploads, setUploads] = useState<UploadPoint[]>([]);
  const [topSubjects, setTopSubjects] = useState<TopSubject[]>([]);
  const [topMaterials, setTopMaterials] = useState<TopMaterial[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [o, u, ts, tm, su] = await Promise.all([
        api.get("/admin/analytics/overview").catch(() => EMPTY),
        api.get("/admin/analytics/uploads-chart?days=14").catch(() => []),
        api.get("/admin/analytics/top-subjects?limit=8").catch(() => []),
        api.get("/admin/analytics/top-materials?limit=10").catch(() => []),
        api.get("/admin/analytics/recent-signups?limit=10").catch(() => []),
      ]);
      setOverview(o || EMPTY);
      setUploads(Array.isArray(u) ? u : []);
      setTopSubjects(Array.isArray(ts) ? ts : []);
      setTopMaterials(Array.isArray(tm) ? tm : []);
      setSignups(Array.isArray(su) ? su : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const statCards = [
    { label: "Students", value: overview.total_students, icon: Users, color: "text-accent" },
    { label: "Question Papers", value: overview.total_papers, icon: FileText, color: "text-blue-400" },
    { label: "Materials Approved", value: overview.approved_materials, icon: BookOpen, color: "text-emerald-400" },
    { label: "Questions Extracted", value: overview.total_questions, icon: Sparkles, color: "text-violet-400" },
    { label: "Subjects", value: overview.total_subjects, icon: GraduationCap, color: "text-amber-400" },
    { label: "Patterns Detected", value: overview.total_patterns, icon: BarChart3, color: "text-pink-400" },
    { label: "Pending Approvals", value: overview.pending_approvals, icon: Clock, color: "text-amber-400" },
    { label: "Admins", value: overview.total_admins, icon: ShieldIcon, color: "text-text-secondary" },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 size={20} className="text-accent" />
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Analytics</h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <LoadingSkeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <LoadingSkeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-7">
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

      {error && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 text-xs text-amber-400">
          {error}
        </div>
      )}

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

      {/* Chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-bg-card border border-border rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
            Uploads · last 14 days
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uploads} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke={TICK}
                  fontSize={10}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis stroke={TICK} fontSize={10} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#1A1A24",
                    border: `1px solid ${GRID}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#F0F0F5" }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="papers" stroke={ACCENT} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="materials" stroke={BLUE} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-bg-card border border-border rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
            Top subjects (papers)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSubjects} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke={TICK} fontSize={10} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke={TICK}
                  fontSize={10}
                  width={100}
                  tickFormatter={(v: string) => v.length > 14 ? v.slice(0, 14) + "…" : v}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1A1A24",
                    border: `1px solid ${GRID}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="paper_count" fill={ACCENT} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-bg-card border border-border rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
            Top materials (by content size)
          </h3>
          {topMaterials.length === 0 ? (
            <p className="text-xs text-text-muted">No approved materials yet.</p>
          ) : (
            <div className="space-y-1.5">
              {topMaterials.map((m, i) => (
                <div key={m.id} className="flex items-center justify-between gap-2 text-xs px-3 py-2 bg-bg-elevated rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate">{i + 1}. {m.title}</p>
                    <p className="text-text-muted truncate">{m.subjects?.name} · {m.material_type}</p>
                  </div>
                  <span className="text-text-secondary font-medium shrink-0">
                    {m.chunk_count ?? 0} chunks
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
            Recent student signups
          </h3>
          {signups.length === 0 ? (
            <p className="text-xs text-text-muted">No signups yet.</p>
          ) : (
            <div className="space-y-1.5">
              {signups.map(s => (
                <div key={s.id} className="flex items-center justify-between gap-2 text-xs px-3 py-2 bg-bg-elevated rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate">{s.full_name}</p>
                    <p className="text-text-muted truncate">{s.email} · {s.branch || "—"} S{s.semester || "?"}</p>
                  </div>
                  <span className="text-text-muted shrink-0">
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShieldIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
