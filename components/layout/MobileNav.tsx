"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles, BookOpen, MessageSquare } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Predict", icon: Sparkles, href: "/predict" },
  { label: "GTU GPT", icon: MessageSquare, href: "/chat" },
  { label: "Materials", icon: BookOpen, href: "/materials" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-border bg-bg-card">
      {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs transition-colors
              ${active ? "text-accent" : "text-text-secondary hover:text-text-primary"}`}
          >
            <span className={`rounded-lg p-1 ${active ? "bg-accent/10" : ""}`}>
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
