"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CheckCircle,
  FileText,
  GraduationCap,
  Users,
  BarChart3,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/approvals", label: "Approvals", icon: CheckCircle, badge: true },
  { href: "/admin/papers", label: "Question Papers", icon: FileText },
  { href: "/admin/subjects", label: "Subjects", icon: GraduationCap },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const overview = await api.get("/admin/analytics/overview");
        if (!cancelled) setPendingCount(overview?.pending_approvals ?? 0);
      } catch {
        // Silent — overview may fail before SQL is run
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full w-[220px] flex flex-col transition-transform duration-300 ease-out",
          "glass border-r border-border",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-14 px-5">
          <span className="text-[15px] font-semibold tracking-[-0.03em] text-text-primary">
            GTU <span className="text-accent">ExamAI</span>
            <span className="text-[11px] text-text-muted font-normal ml-1.5">Admin</span>
          </span>
          <button
            onClick={onClose}
            className="lg:hidden text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-bg-elevated"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mx-4 h-px bg-border/50" />

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            const showBadge = badge && pendingCount > 0;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                  active
                    ? "bg-accent/12 text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    size={15}
                    className={cn("shrink-0", active ? "text-accent" : "text-text-muted")}
                  />
                  {label}
                </span>
                {showBadge && (
                  <span className="text-[10px] font-semibold bg-amber-500/15 text-amber-400 rounded-full px-1.5 min-w-[18px] text-center tabular-nums">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4">
          <div className="mb-3 h-px bg-border/50" />
          <p className="text-[11px] text-text-muted tracking-wide">GTU ExamAI · Admin · v4</p>
        </div>
      </aside>
    </>
  );
}
