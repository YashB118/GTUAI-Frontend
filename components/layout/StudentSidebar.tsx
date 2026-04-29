"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  FileQuestion,
  Upload,
  MessageSquare,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/predict", label: "Predict Exam", icon: Sparkles },
  { href: "/chat", label: "GTU GPT", icon: MessageSquare },
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
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                )}
              >
                <Icon
                  size={15}
                  className={cn("shrink-0", active ? "text-accent" : "text-text-muted")}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4">
          <div className="mx-0 mb-3 h-px bg-border/50" />
          <p className="text-[11px] text-text-muted tracking-wide">GTU ExamAI · v6</p>
        </div>
      </aside>
    </>
  );
}
