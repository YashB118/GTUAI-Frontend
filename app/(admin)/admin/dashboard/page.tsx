"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  CheckCircle,
  Clock,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface Stats {
  totalPapers: number;
  pendingMaterials: number;
  totalUsers: number;
  totalMaterials: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPapers: 0,
    pendingMaterials: 0,
    totalUsers: 0,
    totalMaterials: 0,
  });

  useEffect(() => {
    async function load() {
      const [papers, materials, users] = await Promise.all([
        api.get("/papers/").catch(() => []),
        api.get("/materials/?approved_only=false").catch(() => []),
        api.get("/auth/users").catch(() => []),
      ]);
      const p = Array.isArray(papers) ? papers : [];
      const m = Array.isArray(materials) ? materials : [];
      const u = Array.isArray(users) ? users : [];
      setStats({
        totalPapers: p.length,
        pendingMaterials: m.filter((x: { approval_status: string }) => x.approval_status === "pending").length,
        totalUsers: u.length,
        totalMaterials: m.length,
      });
    }
    load();
  }, []);

  const statCards = [
    { label: "Question Papers", value: stats.totalPapers, icon: FileText, color: "text-accent" },
    { label: "Pending Approvals", value: stats.pendingMaterials, icon: Clock, color: "text-amber-400" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
    { label: "Study Materials", value: stats.totalMaterials, icon: BookOpen, color: "text-green-400" },
  ];

  const adminActions = [
    { href: "/admin/approvals", label: "Review pending materials", icon: CheckCircle, urgent: stats.pendingMaterials > 0 },
    { href: "/admin/papers", label: "Manage question papers", icon: FileText, urgent: false },
    { href: "/admin/users", label: "View registered users", icon: Users, urgent: false },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <LayoutDashboard size={20} className="text-accent" />
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Admin Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Actions */}
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
                <Badge variant="warning">{stats.pendingMaterials} pending</Badge>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Phase note */}
      <div className="bg-bg-card border border-border rounded-lg px-4 py-3.5">
        <p className="text-sm text-text-secondary">
          <span className="text-accent font-medium">Phase 3 complete</span> — RAG answer engine, study material processing, and AI predictions are live. Use the sidebar to manage approvals, subjects, papers, and users.
        </p>
      </div>
    </div>
  );
}
