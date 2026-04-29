"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Plus, Trash2, RefreshCw } from "lucide-react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { api } from "@/lib/api";

interface Subject {
  id: string;
  name: string;
  code: string | null;
  branch: string | null;
  semester: number | null;
}

const BRANCHES = ["CE", "IT", "EC", "EE", "ME", "Civil", "CSE", "AI", "DS"];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await api.get("/subjects").catch(() => []);
    setSubjects(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setFormError("Name is required."); return; }
    setCreating(true);
    setFormError("");
    try {
      await api.post("/subjects/", {
        name: name.trim(),
        code: code.trim() || null,
        branch: branch || null,
        semester: semester ? Number(semester) : null,
      });
      setName(""); setCode(""); setBranch(""); setSemester("");
      await load();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to create subject");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await api.delete(`/subjects/${id}`).catch(() => null);
    setSubjects(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap size={20} className="text-accent" />
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Subjects</h1>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Add subject form */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <Plus size={14} className="text-text-muted" />
            <span className="text-sm font-medium text-text-primary">Add Subject</span>
          </div>
        </div>
        <form onSubmit={handleCreate} className="px-5 py-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-text-muted block mb-1">Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Computer Networks"
                required
                className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Code</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. 3150710"
                className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Branch</label>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary appearance-none focus:outline-none focus:border-accent"
              >
                <option value="">Any branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">Semester</label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary appearance-none focus:outline-none focus:border-accent"
              >
                <option value="">Any sem</option>
                {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
          </div>

          {formError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Plus size={13} />
            {creating ? "Adding..." : "Add Subject"}
          </button>
        </form>
      </div>

      {/* Subjects list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            All Subjects ({subjects.length})
          </h2>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : subjects.length === 0 ? (
          <div className="bg-bg-card border border-border rounded-xl p-12 text-center">
            <GraduationCap size={28} className="mx-auto text-text-muted mb-3" />
            <p className="text-sm text-text-secondary">No subjects yet. Add one above.</p>
          </div>
        ) : (
          <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-border bg-bg-elevated">
              <div className="col-span-4 text-xs font-medium text-text-muted uppercase tracking-wide">Name</div>
              <div className="col-span-2 text-xs font-medium text-text-muted uppercase tracking-wide">Code</div>
              <div className="col-span-3 text-xs font-medium text-text-muted uppercase tracking-wide">Branch</div>
              <div className="col-span-2 text-xs font-medium text-text-muted uppercase tracking-wide">Sem</div>
              <div className="col-span-1" />
            </div>
            {subjects.map((s, idx) => (
              <div
                key={s.id}
                className={`grid grid-cols-12 gap-2 px-4 py-3 items-center ${
                  idx !== subjects.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div className="col-span-4 text-sm font-medium text-text-primary truncate">{s.name}</div>
                <div className="col-span-2 text-sm text-text-secondary font-mono">{s.code || "—"}</div>
                <div className="col-span-3 text-sm text-text-secondary">{s.branch || "—"}</div>
                <div className="col-span-2 text-sm text-text-secondary">{s.semester ? `Sem ${s.semester}` : "—"}</div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                    className="text-text-muted hover:text-red-400 transition-colors disabled:opacity-40"
                    title="Delete subject"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
