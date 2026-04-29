"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  FileQuestion,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/predict", label: "Predict Exam", icon: Sparkles },
  { href: "/materials", label: "Study Materials", icon: BookOpen },
  { href: "/question-bank", label: "Question Bank", icon: FileQuestion },
  { href: "/my-uploads", label: "My Uploads", icon: Upload },
];

interface StudentSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function StudentSidebar({ open, onClose }: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full w-60 bg-bg-primary border-r border-border flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <span className="text-base font-semibold tracking-tight text-text-primary">
            GTU <span className="text-accent">ExamAI</span>
          </span>
          <button
            onClick={onClose}
            className="lg:hidden text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                  active
                    ? "bg-accent/10 text-accent border-l-2 border-accent pl-2.5"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                )}
              >
                <Icon size={16} className="shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Version badge */}
        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs text-text-muted">Phase 3 · Active</p>
        </div>
      </aside>
    </>
  );
}
