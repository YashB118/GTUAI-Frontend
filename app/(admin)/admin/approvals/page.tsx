"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X, FileText, Clock, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { api } from "@/lib/api";

interface Material {
  id: string;
  title: string;
  description: string;
  material_type: string;
  file_name: string;
  file_size_kb: number;
  approval_status: string;
  processing_status: string | null;
  chunk_count: number | null;
  created_at: string;
  uploaded_by: string;
  subjects?: { name: string; code: string };
}

type TabType = "pending" | "approved" | "rejected";

export default function ApprovalsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabType>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await api.get("/materials/?approved_only=false").catch(() => []);
    setMaterials(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    await api.patch(`/materials/${id}/approve`).catch(() => null);
    await load();
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    const path = rejectReason.trim()
      ? `/materials/${id}/reject?reason=${encodeURIComponent(rejectReason.trim())}`
      : `/materials/${id}/reject`;
    await api.patch(path).catch(() => null);
    setRejectTarget(null);
    setRejectReason("");
    await load();
    setActionLoading(null);
  };

  const filtered = materials.filter(m => m.approval_status === tab);
  const pendingCount = materials.filter(m => m.approval_status === "pending").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle size={20} className="text-accent" />
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Material Approvals</h1>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-elevated p-1 rounded-lg w-fit">
        {(["pending", "approved", "rejected"] as TabType[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              tab === t
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "pending" && pendingCount > 0 && (
              <span className="ml-2 bg-amber-400/20 text-amber-400 text-xs px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <LoadingSkeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-xl p-12 text-center">
          <Clock size={28} className="mx-auto text-text-muted mb-3" />
          <p className="text-sm text-text-secondary">No {tab} materials</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => (
            <div key={m.id} className="bg-bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <FileText size={15} className="text-accent shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{m.title}</p>
                    {m.description && (
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{m.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {m.subjects?.name && (
                        <span className="text-xs text-text-muted">{m.subjects.name}</span>
                      )}
                      <span className="text-text-muted/40 text-xs">·</span>
                      <span className="text-xs text-text-muted capitalize">{m.material_type}</span>
                      <span className="text-text-muted/40 text-xs">·</span>
                      <span className="text-xs text-text-muted">{m.file_size_kb} KB</span>
                      <span className="text-text-muted/40 text-xs">·</span>
                      <span className="text-xs text-text-muted">
                        {new Date(m.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {tab === "pending" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(m.id)}
                        disabled={actionLoading === m.id}
                        className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-50"
                      >
                        <CheckCircle size={11} />
                        Approve
                      </button>
                      <button
                        onClick={() => { setRejectTarget(m.id); setRejectReason(""); }}
                        disabled={actionLoading === m.id}
                        className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-50"
                      >
                        <X size={11} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <Badge variant={tab === "approved" ? "approved" : "rejected"}>
                      {m.approval_status}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Reject reason input */}
              {rejectTarget === m.id && (
                <div className="mt-3 ml-6 flex items-center gap-2">
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="Reason (optional)"
                    className="flex-1 bg-bg-elevated border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-red-400/50"
                  />
                  <button
                    onClick={() => handleReject(m.id)}
                    disabled={actionLoading === m.id}
                    className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                    className="text-text-muted hover:text-text-primary text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Processing status badge for approved */}
              {tab === "approved" && m.processing_status && (
                <div className="mt-2 ml-6">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    m.processing_status === "processed"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : m.processing_status === "failed"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {m.processing_status === "processed"
                      ? `AI indexed · ${m.chunk_count ?? 0} chunks`
                      : m.processing_status === "failed"
                      ? "Processing failed"
                      : m.processing_status === "queued"
                      ? "Queued for processing"
                      : "Processing..."}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
