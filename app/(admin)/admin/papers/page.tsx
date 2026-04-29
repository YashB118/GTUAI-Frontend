"use client";

import { useState, useEffect } from "react";
import { FileText, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { api } from "@/lib/api";

interface Paper {
  id: string;
  file_name: string;
  year: number;
  exam_type: string;
  processing_status: string;
  question_count: number;
  created_at: string;
  uploaded_by: string;
  subjects?: { name: string; code: string };
}

interface Subject {
  id: string;
  name: string;
  code: string | null;
}

const statusVariant = (s: string) =>
  s === "done" ? "approved" : s === "failed" ? "rejected" : "pending";

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filterSubject, setFilterSubject] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [papersData, subjectsData] = await Promise.all([
      api.get("/papers/").catch(() => []),
      api.get("/subjects").catch(() => []),
    ]);
    setPapers(Array.isArray(papersData) ? papersData : []);
    setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = filterSubject
    ? papers.filter(p => {
        const subj = subjects.find(s => s.id === filterSubject);
        return p.subjects?.name === subj?.name;
      })
    : papers;

  const statusCounts = {
    done: papers.filter(p => p.processing_status === "done").length,
    pending: papers.filter(p => p.processing_status === "pending").length,
    failed: papers.filter(p => p.processing_status === "failed").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-accent" />
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Question Papers</h1>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-bg-card border border-border rounded-xl px-4 py-3">
          <p className="text-xs text-text-muted mb-1">Total</p>
          <p className="text-xl font-semibold text-text-primary">{papers.length}</p>
        </div>
        <div className="bg-bg-card border border-border rounded-xl px-4 py-3">
          <p className="text-xs text-text-muted mb-1">Processed</p>
          <p className="text-xl font-semibold text-emerald-400">{statusCounts.done}</p>
        </div>
        <div className="bg-bg-card border border-border rounded-xl px-4 py-3">
          <p className="text-xs text-text-muted mb-1">Failed / Pending</p>
          <p className="text-xl font-semibold text-amber-400">{statusCounts.failed + statusCounts.pending}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="relative w-64">
        <select
          value={filterSubject}
          onChange={e => setFilterSubject(e.target.value)}
          className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary appearance-none focus:outline-none focus:border-accent"
        >
          <option value="">All subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}{s.code ? ` (${s.code})` : ""}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => <LoadingSkeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-xl p-12 text-center">
          <FileText size={28} className="mx-auto text-text-muted mb-3" />
          <p className="text-sm text-text-secondary">No papers found</p>
        </div>
      ) : (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-border bg-bg-elevated">
            <div className="col-span-4 text-xs font-medium text-text-muted uppercase tracking-wide">File</div>
            <div className="col-span-3 text-xs font-medium text-text-muted uppercase tracking-wide">Subject</div>
            <div className="col-span-1 text-xs font-medium text-text-muted uppercase tracking-wide">Year</div>
            <div className="col-span-2 text-xs font-medium text-text-muted uppercase tracking-wide">Type</div>
            <div className="col-span-2 text-xs font-medium text-text-muted uppercase tracking-wide">Status</div>
          </div>
          {filtered.map((p, idx) => (
            <div
              key={p.id}
              className={`grid grid-cols-12 gap-2 px-4 py-3 items-center ${
                idx !== filtered.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <div className="col-span-4 min-w-0">
                <p className="text-sm text-text-primary truncate">{p.file_name}</p>
                {p.question_count > 0 && (
                  <p className="text-xs text-text-muted">{p.question_count} questions</p>
                )}
              </div>
              <div className="col-span-3 text-sm text-text-secondary truncate">
                {p.subjects?.name || "—"}
              </div>
              <div className="col-span-1 text-sm text-text-secondary">{p.year}</div>
              <div className="col-span-2 text-sm text-text-secondary capitalize">{p.exam_type}</div>
              <div className="col-span-2">
                <Badge variant={statusVariant(p.processing_status)}>
                  {p.processing_status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
