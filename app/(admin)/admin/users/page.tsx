"use client";

import { useState, useEffect } from "react";
import { Users, RefreshCw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { api } from "@/lib/api";

interface User {
  id: string;
  full_name: string;
  email: string;
  branch: string | null;
  semester: number | null;
  enrollment_no: string | null;
  role: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await api.get("/auth/users").catch(() => []);
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = search.trim()
    ? users.filter(u =>
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.enrollment_no?.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-accent" />
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Users</h1>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Stats + Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-3">
          <div className="bg-bg-card border border-border rounded-xl px-4 py-2.5">
            <p className="text-xs text-text-muted">Total</p>
            <p className="text-lg font-semibold text-text-primary">{users.length}</p>
          </div>
          <div className="bg-bg-card border border-border rounded-xl px-4 py-2.5">
            <p className="text-xs text-text-muted">Students</p>
            <p className="text-lg font-semibold text-text-primary">
              {users.filter(u => u.role === "student").length}
            </p>
          </div>
          <div className="bg-bg-card border border-border rounded-xl px-4 py-2.5">
            <p className="text-xs text-text-muted">Admins</p>
            <p className="text-lg font-semibold text-text-primary">
              {users.filter(u => u.role === "admin").length}
            </p>
          </div>
        </div>

        <div className="relative w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, enrollment..."
            className="w-full bg-bg-card border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent placeholder:text-text-muted"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => <LoadingSkeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-xl p-12 text-center">
          <Users size={28} className="mx-auto text-text-muted mb-3" />
          <p className="text-sm text-text-secondary">
            {search ? "No users match your search" : "No users yet"}
          </p>
        </div>
      ) : (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-border bg-bg-elevated">
            <div className="col-span-3 text-xs font-medium text-text-muted uppercase tracking-wide">Name</div>
            <div className="col-span-3 text-xs font-medium text-text-muted uppercase tracking-wide">Email</div>
            <div className="col-span-2 text-xs font-medium text-text-muted uppercase tracking-wide">Enrollment</div>
            <div className="col-span-1 text-xs font-medium text-text-muted uppercase tracking-wide">Branch</div>
            <div className="col-span-1 text-xs font-medium text-text-muted uppercase tracking-wide">Sem</div>
            <div className="col-span-1 text-xs font-medium text-text-muted uppercase tracking-wide">Role</div>
            <div className="col-span-1 text-xs font-medium text-text-muted uppercase tracking-wide">Joined</div>
          </div>
          {filtered.map((u, idx) => (
            <div
              key={u.id}
              className={`grid grid-cols-12 gap-2 px-4 py-3 items-center ${
                idx !== filtered.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <div className="col-span-3 text-sm font-medium text-text-primary truncate">{u.full_name || "—"}</div>
              <div className="col-span-3 text-sm text-text-secondary truncate">{u.email}</div>
              <div className="col-span-2 text-sm text-text-secondary font-mono truncate">{u.enrollment_no || "—"}</div>
              <div className="col-span-1 text-sm text-text-secondary">{u.branch || "—"}</div>
              <div className="col-span-1 text-sm text-text-secondary">{u.semester || "—"}</div>
              <div className="col-span-1">
                <Badge variant={u.role === "admin" ? "accent" : "default"}>
                  {u.role}
                </Badge>
              </div>
              <div className="col-span-1 text-xs text-text-muted">
                {new Date(u.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
